using Femur.FileSystem;
using Femur;
using Microsoft.AspNetCore.Mvc;
using Server.BlogPosts;
using Server;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables("ENV_");

builder.Services.AddTransient<BlogPostsEndpoint>();

builder.Services.AddKeyedSingleton("client", new DefaultFileSystem("./_ClientApp/build/client"));

builder.Services.AddTransient<DirectusBlogPostsService>();

builder.Services.AddHttpClient(nameof(DirectusBlogPostsService), c =>
{
    c.BaseAddress = new Uri("https://directus-1.redwater-cf35733f.centralus.azurecontainerapps.io");
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddReverseProxy()
        .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
}

builder.Services.TryConfigureByConventionWithValidation<DirectusOptions>();

var app = builder.Build();

// app.UseHttpsRedirection();

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
    app.MapGet("/{**slug}", async ([FromKeyedServices("client")] DefaultFileSystem fs, HttpContext context, CancellationToken cancellationToken, [FromRoute] string? slug = null) =>
    {
        context.SetMaxAge1StaleInfinite();

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
