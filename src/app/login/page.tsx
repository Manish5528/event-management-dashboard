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

type LoginFormInputs = {
  username: string;
  password: string;
};

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const onSubmit = async (data: LoginFormInputs) => {
    const success = await login(data.username, data.password);
    if (success) {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid username or password!");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username  <span className={styles.required}>*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
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
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className={`${styles.button} ${styles.green}`}>
            Register
          </button>

          <p className={styles.linkText}>
            Don't have an account?{" "}
            <Link href={APP_ROUTES.register} className={styles.link}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
