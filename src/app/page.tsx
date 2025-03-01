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
    console.log(`newErrors`, newErrors)
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      startTransition(async () => {
        try {
          const result = await submitAddress(formData)
          console.log("Form submitted result:", result);
          if (result.success) {
            setMessage(result.message);
          } else {
            if (result.errors) setErrors(result.errors as AddressFormErrors);
            setMessage(result.message);
          }
        } catch (error) {
          setMessage("An unexpected error occurred");
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
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="suburb"
          value={formData.suburb}
          onChange={handleChange}
          placeholder="Suburb"
        />
        {errors.suburb && <span>{errors.suburb[0]}</span>}
      </div>
      <div className="form-row">
        <input
          type="text"
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          placeholder="Postcode"
        />
        {errors.postcode && <span>{errors.postcode[0]}</span>}
      </div>
      <div className="form-row">
        <select
          name="state"
          className="form-field"
          value={formData.state}
          onChange={handleChange}
        >
          <option value="">Select state</option>
          {stateOptions.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && errors.state.length > 0 && (
          <div className="form-msg">{errors.state[0]}</div>
        )}
      </div>
      {
        message &&
        <div>{ message }</div>
      }
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
