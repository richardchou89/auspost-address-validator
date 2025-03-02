'use client'

import { ChangeEvent, FormEvent, startTransition, useState } from "react"
import * as z from "zod"
import { AddressFormType, AddressFormErrors, addressFormSchema } from "@/lib/address-form-schema";
import { submitAddress } from "@/actions/address";

const stateOptions = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]; 

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<AddressFormType>({
    suburb: "",
    postcode: "",
    state: ""
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  const validateForm = (data: AddressFormType): AddressFormErrors => {
    try {
      addressFormSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.flatten().fieldErrors;
      }
      return {};
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setMessage("");
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      startTransition(async () => {
        try {
          const result = await submitAddress(formData)
          if (result.success) {
            setMessage(result.message);
          } else {
            if (result.errors) setErrors(result.errors as AddressFormErrors);
            setMessage(result.message);
          }
          setIsSubmitting(false);
        } catch {
          setMessage("An unexpected error occurred");
          setIsSubmitting(false);
        }
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    const newErrors = validateForm(updatedFormData);
    setErrors(newErrors);
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl lg:w-1/3 w-full p-4">
      <h1 className="text-2xl font-bold">Address Information</h1>
      <h3 className="mt-2">Enter your location details below.</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-row w-full pr-0">
          <input
            type="text"
            name="suburb"
            value={formData.suburb}
            onChange={handleChange}
            placeholder="Enter your suburb"
            className="border-2 border-gray-300 rounded-md w-full h-10 p-2"
          />
          {errors.suburb && <span className="text-red-500">{errors.suburb[0]}</span>}
        </div>
        <div className="flex lg:flex-row flex-col mt-4">
          <div className="form-row lg:w-1/2 w-full lg:pr-2">
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              placeholder="e.g. 3000"
              className="border-2 border-gray-300 rounded-md w-full h-10 p-2"
            />
            {errors.postcode && <span className="text-red-500">{errors.postcode[0]}</span>}
          </div>
          <div className="form-row lg:pl-2 lg:w-1/2 w-full w-1/2 lg:mt-0 mt-4">
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-field border-2 border-gray-300 rounded-md w-full h-10 p-2"
            >
              <option className="text-gray-500" value="">Select state</option>
              {stateOptions.map((state) => (
                <option className="text-black" key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && errors.state.length > 0 && (
              <div className="text-red-500">{errors.state[0]}</div>
            )}
          </div>
        </div>
        {
          message &&
          <div className="mt-4 text-green-500">{ message }</div>
        }
        <div className="text-center mt-4">
          <button className="bg-black text-white w-full rounded-md h-10" type="submit">{ isSubmitting ? "Querying" : "Submit" }</button>
        </div>
      </form>
    </div>
  )
}
