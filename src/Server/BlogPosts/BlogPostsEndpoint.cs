using System.Text.Json;
using System.Text.Json.Serialization;
using Ardalis.Result.AspNetCore;
using Femur;
using Microsoft.AspNetCore.Mvc;

namespace Server.BlogPosts;


public class BlogPostsEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpointRouteBuilder)
    {
        endpointRouteBuilder.MapEndpoint<BlogPostsEndpoint>("/api/posts", [HttpMethod.Get], i => i.GetAllPostsAsync);
        endpointRouteBuilder.MapEndpoint<BlogPostsEndpoint>("/api/posts/{slug}", [HttpMethod.Get], i => i.GetPostAsync);
    }

    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly DirectusBlogPostsService _directusBlogPostsService;
    public BlogPostsEndpoint(DirectusBlogPostsService directusBlogPostsService)
    {
        _jsonSerializerOptions = new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };
        _directusBlogPostsService = directusBlogPostsService;
    }

    public async Task<IResult> GetAllPostsAsync(HttpContext context, CancellationToken cancellationToken)
    {
        // var files = await _defaultFileSystem.GetFilesAsync("./posts", cancellationToken: cancellationToken);

        var files = await _directusBlogPostsService.GetAllItemsAsync<LeakyBlogPost>(cancellationToken);

        if (!files.IsSuccess)
        {
            return files.ToMinimalApiResult();
        }

        var posts = new List<BlogFrontMatterDto>();

        foreach (var file in files.Value)
        {
            var dto = file.ToDto(false);

            posts.Add(dto);
        }

        context.SetMaxAge1StaleInfinite();

        return Results.Json(posts, _jsonSerializerOptions);
    }

    public async Task<IResult> GetPostAsync([FromRoute] string slug, HttpContext context, CancellationToken cancellationToken)
    {
        // var file = await Get($"./posts/{slug}.md", true, cancellationToken);

        var file = await _directusBlogPostsService.GetItemAsync<LeakyBlogPost>(slug, cancellationToken);

        if (!file.IsSuccess)
        {
            return file.ToMinimalApiResult();
        }

        var dto = file.Value.ToDto(true);

        context.SetMaxAge1StaleInfinite();

        return Results.Json(dto, _jsonSerializerOptions);
    }
}

public class LeakyBlogPost
{
    public int Id { get; set; }
    public required string Status { get; set; }

    [JsonPropertyName("date_created")]
    public DateTimeOffset DateCreated { get; set; }

    [JsonPropertyName("date_updated")]
    public DateTimeOffset DateUpdated { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public string? Snippet { get; set; }
    public string[] Tags { get; set; } = Array.Empty<string>();
}

public class BlogFrontMatterDto
{
    public string? Content { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required DateTimeOffset PublishedAt { get; set; }
    public string? Snippet { get; set; }
    public required string[] Tags { get; set; }
}

public static class BlogFrontMatterExtensions
{
    public static BlogFrontMatterDto ToDto(this LeakyBlogPost b, bool withContent)
    {
        return new BlogFrontMatterDto()
        {
            Slug = $"posts/{b.Id}",
            Title = b.Title,
            PublishedAt = b.DateCreated,
            Snippet = b.Snippet,
            Tags = b.Tags,
            Content = withContent ? b.Content : null
        };
    }
}