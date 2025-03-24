
namespace Server;

public static class CacheHeaderExtensions
{
    public static void SetMaxAge1StaleInfinite(this HttpContext context)
    {
        context.Response.Headers.Append("cdn-cache-control", "public, max-age=1, stale-while-revalidate=31560000");
    }
}