import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "./CountrySelector";
import { FlagComponent } from "./FlagComponent";

type PhoneNumberInputProps = {
    value?: string;
    // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange: (value?: string) => void;
    country: Country;
    setCountry: React.Dispatch<React.SetStateAction<Country>>;
};

export function PhoneNumberInput({
    value,
    onChange,
    country,
    setCountry
}: PhoneNumberInputProps) {
    return (
        <PhoneInput
            country={country}
            value={value}
            onChange={onChange}
            inputComponent={Input}
            placeholder="7042422393"
            id="signup-tel"
            autoComplete="tel"
            countrySelectComponent={(props) => (
                <CountrySelect {...props} value={country} onChange={setCountry} />
            )}
            flagComponent={(props) => (
                <FlagComponent country={props.country} />
            )}
            className="w-full gap-2"
            numberInputProps={{
                className: "h-11 md:text-base"
            }}
        />
    );
}