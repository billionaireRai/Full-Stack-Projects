"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPaymentGateway() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("Standard");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam && plans[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const plans = {
    Freemium: {
      name: "Freemium",
      price: "$0/mo",
      description: "Get started with essential features.",
      features: [
        "Basic access",
        "1 device only",
        "Community support",
        "Limited storage",
      ],
    },
    Basic: {
      name: "Basic",
      price: "$10/mo",
      description: "Best suited for individual users.",
      features: [
        "All Freemium features",
        "Email support",
        "2 devices",
        "100 GB storage",
      ],
    },
    Standard: {
      name: "Standard",
      price: "$20/mo",
      description: "Perfect for small teams & power users.",
      features: [
        "All Basic features",
        "Priority support",
        "Up to 5 devices",
        "1 TB storage",
      ],
    },
    Premium: {
      name: "Premium",
      price: "$40/mo",
      description: "Full access for businesses & families.",
      features: [
        "All Standard features",
        "Unlimited devices",
        "24/7 support",
        "Family sharing",
        "Unlimited storage",
      ],
    },
  };

  const plan = plans[selectedPlan];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-24 pb-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-800">
          💳 Confirm Your Plan & Pay
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto text-lg">
          You’ve selected the <span className="font-semibold">{plan.name}</span> plan. Fill in your
          payment details to complete your subscription.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Plan Summary */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border-none">
            <h2 className="text-2xl font-semibold text-blue-900 mb-1">{plan.name} Plan</h2>
            <p className="text-gray-700 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold text-blue-700 mb-6">{plan.price}</div>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-800">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">🔐 Payment Details</h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                  className="transition-all duration-300 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  name="number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  className="transition-all duration-300 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    name="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    className="transition-all duration-300 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    name="cvv"
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    className="transition-all duration-300 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold text-lg"
              >
                Pay {plan.price}
              </button>
            </form>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 text-center space-y-6">
          <p className="text-gray-600">
            Need help? Reach out to our support team or cancel payment below.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button className="cursor-pointer bg-red-100 text-red-600 px-5 py-2 rounded-md hover:bg-red-200 transition">
              Cancel Payment
            </button>
            <button className="cursor-pointer bg-gray-100 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-200 transition">
              Contact Support
            </button>
            <button className="cursor-pointer bg-green-100 text-green-700 px-5 py-2 rounded-md hover:bg-green-200 transition">
              Change Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
