"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

type CustomSelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className = ""
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalized = normalize(query);
    if (!normalized) return options;
    return options.filter((option) => normalize(option.label).includes(normalized));
  }, [options, query]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          value={open ? query : (selected?.label ?? "")}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && open && filteredOptions[0]) {
              event.preventDefault();
              onChange(filteredOptions[0].value);
              setQuery("");
              setOpen(false);
            }
          }}
          className={`w-full pr-10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
        <button
          type="button"
          aria-label={`Abrir opções de ${ariaLabel}`}
          disabled={disabled}
          onClick={() => {
            setOpen((current) => !current);
            setQuery("");
          }}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-of-muted disabled:opacity-50"
        >
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-of-border bg-[#171717] p-1.5 shadow-2xl shadow-black/50"
        >
          <div className="mb-1 flex items-center gap-2 border-b border-of-border px-2 py-1.5 text-xs text-of-muted">
            <Search className="h-3.5 w-3.5" />
            Digite para filtrar
          </div>
          {filteredOptions.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange(option.value);
                  setQuery("");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  active ? "bg-of-primary/15 text-of-primary" : "text-of-text hover:bg-white/5"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {active ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
          {filteredOptions.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-of-muted">Nenhuma opção encontrada</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
