using System.Text.Json;
using Femur.FileSystem;
using Server.BlogPosts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<BlogPostsEndpoint>();

builder.Services.AddSingleton(new DefaultFileSystem("./server"));

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

BlogPostsEndpoint.MapEndpoint(app);

app.MapReverseProxy();

app.Run();
