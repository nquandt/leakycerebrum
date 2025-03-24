
using Femur;
using FluentValidation;

namespace Server;

public class DirectusOptions : IStandardOptions<DirectusOptions>
{
    public static string SectionName => "Directus";

    public required string BaseUrl { get; set; }
    public required string BlogCollectionName { get; set; }

    public static void SetupValidator(AbstractValidator<DirectusOptions> validator)
    {
        validator.RuleFor(x => x.BaseUrl)
            .NotEmpty()
            .WithMessage("BaseUrl for Directus is required");

        validator.RuleFor(x => x.BlogCollectionName)
            .NotEmpty()
            .WithMessage("Specify the CollectionName for our blog posts");
    }
}