using System.Text.Json;
using Femur;
using Femur.FileSystem;
using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Syntax;
using Microsoft.AspNetCore.Mvc;
using YamlDotNet.Serialization;

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
    public BlogPostsEndpoint([FromKeyedServices("server")]DefaultFileSystem defaultFileSystem)
    {
        _defaultFileSystem = defaultFileSystem;
        _jsonSerializerOptions = JsonSerializerOptions.Web;
    }

    public async Task<IResult> GetAllPostsAsync(HttpContext context, CancellationToken cancellationToken)
    {
        var files = await _defaultFileSystem.GetFilesAsync("./posts", cancellationToken: cancellationToken);

        var posts = new List<BlogFrontMatterDto>();

        foreach (var file in files)
        {
            if (await Get(file, false, cancellationToken) is {} dto)
            {
                posts.Add(dto);
            }
        }

        return Results.Json(posts, _jsonSerializerOptions);
    }

    public async Task<IResult> GetPostAsync([FromRoute] string slug, HttpContext context, CancellationToken cancellationToken)
    {
        var file = await Get($"./posts/{slug}.md", true, cancellationToken);        

        return Results.Json(file, _jsonSerializerOptions);
    }

    private async Task<BlogFrontMatterDto?> Get(string file, bool withContent = false, CancellationToken cancellationToken = default)
    {
        var content = await _defaultFileSystem.OpenReadAsync(file, cancellationToken);
        // convert stream to string
        using StreamReader reader = new StreamReader(content);
        string md = await reader.ReadToEndAsync();

        var ft = md.GetFrontMatter<BlogFrontMatter>();
        return ft?.ToDto(file.Split('.')[0], withContent ? md : null);
    }
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

public class BlogFrontMatter
{
    [YamlMember(Alias = "title")]
    public required string Title { get; set; }

    [YamlMember(Alias = "published_at")]
    public required DateTimeOffset PublishedAt { get; set; }

    [YamlMember(Alias = "snippet")]
    public string? Snippet { get; set; }

    [YamlMember(Alias = "tags")]
    public string? Tags { get; set; }

    [YamlIgnore]
    public string[] GetTags => Tags?
        .Split(",", StringSplitOptions.RemoveEmptyEntries)
        .Select(x => x.Trim())
        .ToArray() ?? Array.Empty<string>();
}

public static class BlogFrontMatterExtensions
{
    public static BlogFrontMatterDto ToDto(this BlogFrontMatter b, string slug, string? content)
    {
        return new BlogFrontMatterDto()
        {
            Slug = slug,
            Title = b.Title,
            PublishedAt = b.PublishedAt,
            Snippet = b.Snippet,
            Tags = b.GetTags,
            Content = content
        };
    }
}


public static class MarkdownExtensions
{
    private static readonly IDeserializer YamlDeserializer =
        new DeserializerBuilder()
        .IgnoreUnmatchedProperties()
        .Build();

    private static readonly MarkdownPipeline Pipeline
        = new MarkdownPipelineBuilder()
        .UseYamlFrontMatter()
        .Build();

    public static T? GetFrontMatter<T>(this string markdown)
    {
        var document = Markdown.Parse(markdown, Pipeline);
        var block = document
            .Descendants<YamlFrontMatterBlock>()
            .FirstOrDefault();

        if (block == null)
            return default;

        var yaml =
            block
            // this is not a mistake
            // we have to call .Lines 2x
            .Lines // StringLineGroup[]
            .Lines // StringLine[]
            .OrderByDescending(x => x.Line)
            .Select(x => $"{x}\n")
            .ToList()
            .Select(x => x.Replace("---", string.Empty))
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Aggregate((s, agg) => agg + s);

        return YamlDeserializer.Deserialize<T>(yaml);
    }
}
