import flags from "react-phone-number-input/flags";
import type { Country } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";

type FlagComponentProps = {
    country: Country;
};

export function FlagComponent({ country }: FlagComponentProps) {
    const Flag = flags[country];

    return (
        <span
            className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full"
            role="img"
            aria-label={en[country]}
            title={en[country]}
        >
            {Flag && <Flag title={en[country]} />}
        </span>
    );
}