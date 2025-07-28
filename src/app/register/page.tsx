"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import styles from "@/styles/AuthForm.module.css";
import Link from "next/link";
import toast from "react-hot-toast";
import { APP_ROUTES } from "@/utils/route";

type RegisterFormInputs = {
  username: string;
  password: string;
  confirmPassword: string;
};

const registerSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function RegisterPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const onSubmit = async (data: RegisterFormInputs) => {
    const success = await signup(data.username, data.password);
    if (success) {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } else {
      toast.error("Username already exists!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={styles.input}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={styles.input}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>

          <p className={styles.linkText}>
            Already have an account?{" "}
            <Link href={APP_ROUTES.login} className={styles.link}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
