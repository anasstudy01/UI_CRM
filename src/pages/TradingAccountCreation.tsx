import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { accountsAPI } from "../services/api";
import type { AccountCreationFormData, AccountType } from "../types/index";

/**
 * Trading Account Creation page component
 * Allows users to create new trading accounts with various configurations
 */
const TradingAccountCreation: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

  // Function to generate random 8-digit password
  const generateRandomPassword = (): string => {
    let text = "";
    const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const small = "abcdefghijklmnopqrstuvwxyz";
    const number = "0123456789";
    const splchar = "!@$%()";
    for (let i = 0; i < 3; i++)
      text += caps.charAt(Math.floor(Math.random() * caps.length));
    for (let i = 0; i < 2; i++)
      text += small.charAt(Math.floor(Math.random() * small.length));
    for (let i = 0; i < 3; i++)
      text += number.charAt(Math.floor(Math.random() * number.length));
    for (let i = 0; i < 1; i++)
      text += splchar.charAt(Math.floor(Math.random() * splchar.length));
    return text;

   
  };

  // Fetch account types from db.json
  useEffect(() => {
    fetch("/data/db.json")
      .then((res) => res.json())
      .then((data) => setAccountTypes(data.accountTypes || []))
      .catch((error) => console.error("Failed to fetch account types:", error));
  }, []);

  // Validation schema for account creation
  const validationSchema = Yup.object({
    platformType: Yup.string()
      .oneOf(["MT5", "MT4"], "Invalid platform type")
      .required("Platform type is required"),
    accountVariant: Yup.string()
      .oneOf(["Live", "Demo"], "Invalid account variant")
      .required("Account variant is required"),
    accountType: Yup.string().required("Account type is required"),
    currency: Yup.string()
      .oneOf(["USD", "EUR", "GBP"], "Invalid currency")
      .required("Currency is required"),
    leverage: Yup.string()
      .oneOf(["1:50", "1:100", "1:200", "1:500"], "Invalid leverage")
      .required("Leverage is required"),
    investorPassword: Yup.string()
      .min(8, "Investor password must be 8 characters")
      .required("Investor password is required"),
    masterPassword: Yup.string()
      .min(8, "Master password must be 8 characters")
      .required("Master password is required"),
    initialDeposit: Yup.number()
      .min(100, "Minimum deposit is $100")
      .when("accountVariant", {
        is: "Live",
        then: (schema) =>
          schema.required("Initial deposit is required for live accounts"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  // Form handling with Formik
  const formik = useFormik<AccountCreationFormData>({
    initialValues: {
      platformType: "MT5",
      accountVariant: "Demo",
      accountType: "",
      currency: "USD",
      leverage: "1:100",
      investorPassword: generateRandomPassword(),
      masterPassword: generateRandomPassword(),
      initialDeposit: undefined,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await accountsAPI.createAccount({
          ...values,
          userId: 1, // In real app, get from auth context
          accountNumber: `AMB${Date.now()}`,
          balance:
            values.accountVariant === "Live"
              ? values.initialDeposit || 0
              : 10000,
          status: "Active",
        });
        setSuccess(true);
        formik.resetForm();
      } catch (error) {
        console.error("Failed to create account:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your trading account has been created and is ready to use.
            </p>
            <Button onClick={() => setSuccess(false)}>
              Create Another Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Trading Account
        </h1>
        <p className="text-gray-600">
          Set up a new trading account with your preferred configuration
        </p>
      </div>

      <Card>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Platform Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Type <span className="text-red-500">*</span>
            </label>
            <select
              name="platformType"
              value={formik.values.platformType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="MT5">MT5</option>
              <option value="MT4">MT4</option>
            </select>
            {formik.touched.platformType && formik.errors.platformType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.platformType}
              </p>
            )}
          </div>

          {/* Account Variant Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account Variant <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Demo", "Live"].map((type) => (
                <label
                  key={type}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formik.values.accountVariant === type
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountVariant"
                    value={type}
                    checked={formik.values.accountVariant === type}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {type} Account
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {type === "Demo"
                        ? "Practice trading with virtual money"
                        : "Trade with real money"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Account Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select One</option>
              {accountTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {formik.touched.accountType && formik.errors.accountType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.accountType}
              </p>
            )}
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Currency <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
            {formik.touched.currency && formik.errors.currency && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.currency}
              </p>
            )}
          </div>

          {/* Leverage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leverage <span className="text-red-500">*</span>
            </label>
            <select
              name="leverage"
              value={formik.values.leverage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="1:50">1:50</option>
              <option value="1:100">1:100</option>
              <option value="1:200">1:200</option>
              <option value="1:500">1:500</option>
            </select>
            {formik.touched.leverage && formik.errors.leverage && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.leverage}
              </p>
            )}
          </div>

          {/* Investor Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investor Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="investorPassword"
                value={formik.values.investorPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Auto-generated password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  formik.setFieldValue(
                    "investorPassword",
                    generateRandomPassword()
                  )
                }
              >
                Generate
              </Button>
            </div>
            {formik.touched.investorPassword &&
              formik.errors.investorPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.investorPassword}
                </p>
              )}
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Master Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="masterPassword"
                value={formik.values.masterPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Auto-generated password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  formik.setFieldValue(
                    "masterPassword",
                    generateRandomPassword()
                  )
                }
              >
                Generate
              </Button>
            </div>
            {formik.touched.masterPassword && formik.errors.masterPassword && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.masterPassword}
              </p>
            )}
          </div>

          {/* Initial Deposit (Live accounts only) */}
          {formik.values.accountVariant === "Live" && (
            <Input
              label="Initial Deposit"
              type="number"
              name="initialDeposit"
              placeholder="100"
              value={formik.values.initialDeposit || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.initialDeposit && formik.errors.initialDeposit
                  ? formik.errors.initialDeposit
                  : undefined
              }
              required
            />
          )}

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Important Information:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Demo accounts come with $10,000 virtual money</li>
              <li>• Live accounts require a minimum deposit of $100</li>
              <li>• Leverage increases both potential profits and losses</li>
              <li>• You can modify account settings after creation</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TradingAccountCreation;
