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

    public async Task<T?> GetItemAsync<T>(string id, CancellationToken cancellationToken) where T : class
    {
        using var client = _httpClientFactory.CreateClient(nameof(DirectusBlogPostsService));

        using var request = new HttpRequestMessage(HttpMethod.Get, $"/items/{_directusOptions.BlogCollectionName}/{id}");

        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return (await response.Content.ReadFromJsonAsync<DirectusData<T>>(JsonSerializerOptions.Web, cancellationToken: cancellationToken))!.Data;
    }

    public async Task<IEnumerable<T>> GetAllItemsAsync<T>(CancellationToken cancellationToken) where T : class
    {
        using var client = _httpClientFactory.CreateClient(nameof(DirectusBlogPostsService));

        using var request = new HttpRequestMessage(HttpMethod.Get, $"/items/{_directusOptions.BlogCollectionName}");

        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return Enumerable.Empty<T>();
        }

        return (await response.Content.ReadFromJsonAsync<DirectusData<IEnumerable<T>>>(JsonSerializerOptions.Web, cancellationToken: cancellationToken))!.Data;
    }
}

public class DirectusData<T>
{
    public T Data { get; set; } = default!;
}