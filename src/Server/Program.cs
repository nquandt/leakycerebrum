using System.Text.Json;
using Femur.FileSystem;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Server.BlogPosts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<BlogPostsEndpoint>();

builder.Services.AddKeyedSingleton("server", new DefaultFileSystem("./server"));
builder.Services.AddKeyedSingleton("client", new DefaultFileSystem("./_ClientApp/build/client"));

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddReverseProxy()
        .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
}

var app = builder.Build();

app.UseHttpsRedirection();

static string? GetContentTypeFromExtension(string slug)
{
    var split = slug.Split('.');
    if (split.Length > 0)
    {
        switch (split.Last())
        {
            case "md":
                return "text/plain";
            case "js":
                return "text/javascript";
            case "json":
                return "application/json";
            case "html":
                return "text/html";
            case "ico":
                return "image/vnd.microsoft.icon";
            case "svg":
                return "image/svg+xml";
            case "css":
                return "text/css";
        }
    }

    return null;
}

if (app.Environment.IsProduction())
{
    // var directory = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location)!;
    // var finalPath = Path.Combine(directory!, "_ClientApp/build/client");

    // app.UseFileServer(new FileServerOptions
    // {
    //     FileProvider = new PhysicalFileProvider(finalPath),
    //     RequestPath = "",
    //     RedirectToAppendTrailingSlash = false,
    //     EnableDirectoryBrowsing = false
    // });

    app.MapGet("/{**slug}", async ([FromKeyedServices("client")] DefaultFileSystem fs, CancellationToken cancellationToken, [FromRoute] string? slug = null) =>
    {
        slug ??= "./index.html";
        if (await fs.FileExistsAsync(slug))
        {
            var file = await fs.OpenReadAsync(slug, cancellationToken);

            var contentType = GetContentTypeFromExtension(slug);

            return Results.Stream(file, contentType);
        }

        slug = (slug.EndsWith("/") ? slug.Substring(0, slug.Length - 1) : slug) + "/index.html";

        if (await fs.FileExistsAsync(slug))
        {
            var file = await fs.OpenReadAsync(slug, cancellationToken);

            return Results.Stream(file, "text/html");
        }

        return Results.Stream(await fs.OpenReadAsync("./__spa-fallback.html", cancellationToken), "text/html");
    });
}


BlogPostsEndpoint.MapEndpoint(app);

if (app.Environment.IsDevelopment())
{
    app.MapReverseProxy();
}

app.Run();
