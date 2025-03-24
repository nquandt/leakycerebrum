using Ardalis.Result;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Server.BlogPosts;

public class DirectusBlogPostsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly DirectusOptions _directusOptions;
    public DirectusBlogPostsService(IHttpClientFactory httpClientFactory, IOptions<DirectusOptions> directusOptions)
    {
        _httpClientFactory = httpClientFactory;
        _directusOptions = directusOptions.Value;
    }

    public async Task<Result<T>> GetItemAsync<T>(string id, CancellationToken cancellationToken) where T : class
    {
        using var client = _httpClientFactory.CreateClient(nameof(DirectusBlogPostsService));

        using var request = new HttpRequestMessage(HttpMethod.Get, $"/items/{_directusOptions.BlogCollectionName}/{id}");

        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            if (response.Headers.TryGetValues("x-powered-by", out var strings) && "Directus".Equals(strings.FirstOrDefault(), StringComparison.InvariantCultureIgnoreCase))
            {
                return Result.NotFound();
            }

            return Result.Error();
        }

        return Result.Success((await response.Content.ReadFromJsonAsync<DirectusData<T>>(JsonSerializerOptions.Web, cancellationToken: cancellationToken))!.Data);
    }

    public async Task<Result<IEnumerable<T>>> GetAllItemsAsync<T>(CancellationToken cancellationToken) where T : class
    {
        using var client = _httpClientFactory.CreateClient(nameof(DirectusBlogPostsService));

        using var request = new HttpRequestMessage(HttpMethod.Get, $"/items/{_directusOptions.BlogCollectionName}");

        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            if (response.Headers.TryGetValues("x-powered-by", out var strings) && "Directus".Equals(strings.FirstOrDefault(), StringComparison.InvariantCultureIgnoreCase))
            {
                return Result.NotFound();
            }

            return Result.Error();
        }

        return Result.Success((await response.Content.ReadFromJsonAsync<DirectusData<IEnumerable<T>>>(JsonSerializerOptions.Web, cancellationToken: cancellationToken))!.Data);
    }
}

public class DirectusData<T>
{
    public T Data { get; set; } = default!;
}