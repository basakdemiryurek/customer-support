import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./styles.css";
import Swal from "sweetalert2";
import axios from "axios";

const CustomerSupportSchema = yup.object().shape({
  email: yup.string().required(),
  phone: yup.string().required(),
  description: yup.string().required(),
  inquiryType: yup.string().required(),
  terms: yup.boolean().oneOf([true], "Messages"),
});

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CustomerSupportSchema),
  });

  React.useEffect(() => {
    document.title = "Contact Us";
  }, []);

  const onSubmit = (data) => {
    axios
      .post(`http://localhost:21760/v1/CustomerSupport`, {
        email: data.email,
        phone: data.phone,
        customerNumber: data.customerNumber,
        inquiryType: data.inquiryType,
        description: data.description,
      })
      .then((res) => {
        if (res.data.isSucceed) {
          Swal.fire({
            icon: "success",
            title: "Your support request has been recieved",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Save form operation is failed",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };
  const getErrorMessage = (field) => {
    return <p className="error-message">{field + " is required"}</p>;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Contact Us</h1>
      <div>
        <label>E-mail</label>
        <input type={"email"} {...register("email")} />
        {errors.email && getErrorMessage("E-mail")}
      </div>
      <div>
        <label>Phone</label>
        <input
          type={"phone"}
          {...register("phone")}
          placeholder="(___) ___ ____"
        />
        {errors.phone && getErrorMessage("Phone")}
      </div>
      <div>
        <label>Customer Number</label>
        <input
          type="number"
          {...register("customerNumber", { valueAsNumber: true })}
        />
      </div>
      <div>
        <label>Subject</label>
        <select {...register("inquiryType")}>
          <option disabled selected value="">
            -- select a subject --
          </option>
          <option value="0">Suggestion</option>
          <option value="1">Complaint</option>
          <option value="2">Other</option>
        </select>
        {errors.inquiryType && getErrorMessage("Subject")}
      </div>
      <div>
        <label>Message</label>
        <textarea {...register("description")} className="description-field" />
        {errors.description && getErrorMessage("Message")}
      </div>
      <div>
        <label className="checkbox-label">
          <input type="checkbox" {...register("terms")} />I agree to the Terms &
          Conditions and Privacy Policy
        </label>
        {errors.terms && getErrorMessage("Terms")}
      </div>
      <input type="submit" />
    </form>
  );
}

export default App;
