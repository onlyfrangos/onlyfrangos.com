'use client';

import { useEffect, useState } from 'react';

import { apiFetch } from '../../lib/auth';
import { CustomSelect } from '../../components/ui/custom-select';

export type StateOption = { codigoUf: number; uf: string; nome: string };
export type CityOption = { codigoIbge: number; nome: string; codigoUf: number };

type Props = {
  stateId: string;
  cityId: string;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  className: string;
};

export function LocationSelects({
  stateId,
  cityId,
  onStateChange,
  onCityChange,
  className,
}: Props) {
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  useEffect(() => {
    void apiFetch('/locations/states')
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => setStates(items as StateOption[]));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
    let active = true;
    void apiFetch(`/locations/cities?stateId=${stateId}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => {
        if (active) setCities(items as CityOption[]);
      });
    return () => {
      active = false;
    };
  }, [stateId]);

  return (
    <>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-of-text">Estado</span>
        <CustomSelect
          value={stateId}
          onChange={onStateChange}
          options={[
            { value: '', label: 'Não informar' },
            ...states.map((state) => ({
              value: String(state.codigoUf),
              label: `${state.nome} (${state.uf})`,
            })),
          ]}
          placeholder="Selecione o estado"
          ariaLabel="Estado"
          className={className}
        />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-of-text">Cidade</span>
        <CustomSelect
          value={cityId}
          onChange={onCityChange}
          options={[
            { value: '', label: 'Não informar' },
            ...cities.map((city) => ({ value: String(city.codigoIbge), label: city.nome })),
          ]}
          placeholder="Selecione a cidade"
          ariaLabel="Cidade"
          className={className}
          disabled={!stateId}
        />
      </label>
    </>
  );
}
