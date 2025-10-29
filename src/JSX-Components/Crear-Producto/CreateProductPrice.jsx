import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function CreateProductPrice({ value, onChange }) {
  const [price, setPrice] = useState(value);

  useEffect(() => {
    setPrice(value);
  }, [value]);

  const formatPrice = (value) => {
    let numbers = value.replace(/[^\d.]/g, '');
    const parts = numbers.split('.');
    if (parts.length > 2) {
      numbers = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2) {
      numbers = parts[0] + '.' + parts[1].slice(0, 2);
    }
    return numbers;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatPrice(value);
    setPrice(formattedValue);
    onChange({ target: { name: 'price', value: formattedValue } });
  };

  return (
    <div>
      <label htmlFor="price" className="block text-1 font-medium text-gray-900">
        Precio del Producto
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-600">
          <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm">$</div>
          <input
            id="price"
            name="price"
            type="text"
            placeholder="0.00"
            value={price}
            onChange={handlePriceChange}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
          />
          <div className="grid shrink-0 grid-cols-1 focus-within:relative">
            <select
              id="currency"
              name="currency"
              aria-label="Currency"
              className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm"
            >
              <option>COP</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}