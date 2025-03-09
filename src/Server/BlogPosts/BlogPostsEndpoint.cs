using System.Text.Json;
using Femur;
using Femur.FileSystem;
using Microsoft.AspNetCore.Mvc;

namespace Server.BlogPosts;


public class BlogPostsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapEndpoint<BlogPostsEndpoint>("/api/posts", [HttpMethod.Get], i => i.GetAllPostsAsync);
        endpointRouteBuilder.MapEndpoint<BlogPostsEndpoint>("/api/posts/{slug}", [HttpMethod.Get], i => i.GetPostAsync);
    }

    private readonly DefaultFileSystem _defaultFileSystem;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    public BlogPostsEndpoint(DefaultFileSystem defaultFileSystem)
    {
        _defaultFileSystem = defaultFileSystem;
        _jsonSerializerOptions = JsonSerializerOptions.Web;
    }

    public async Task<IResult> GetAllPostsAsync(HttpContext context, CancellationToken cancellationToken)
    {
        var files = await _defaultFileSystem.GetFilesAsync("./posts");

        return Results.Json(files, _jsonSerializerOptions);
    }

    public async Task<IResult> GetPostAsync([FromRoute] string slug, HttpContext context, CancellationToken cancellationToken)
    {
        var file = await _defaultFileSystem.OpenReadAsync($"./posts/{slug}.md");        

        return Results.Stream(file, "text/plain");
    }
}