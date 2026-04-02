import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Country,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { useState } from "react";
import { FlagComponent } from "./FlagComponent";


type CountrySelectProps = {
  value?: Country;
  onChange: (value: Country) => void;
};

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 px-3"
        >
          <span className="text-base">
            {value ? `+${getCountryCallingCode(value)}` : "Code"}
          </span>
          <ChevronDown className="h-6 w-6" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>

          <ScrollArea className="h-72">
            <CommandGroup>
              {getCountries().map((country) => (
                <CommandItem
                  key={country}
                  value={en[country]}
                  onSelect={() => {
                    onChange(country);       // select country
                    setPopoverOpen(false);   // close popover immediately
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FlagComponent country={country} />
                    <span>
                      {en[country]} (+{getCountryCallingCode(country)})
                    </span>
                  </div>

                  {country === value && (
                    <Check className="h-4 w-4 text-green-800" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}