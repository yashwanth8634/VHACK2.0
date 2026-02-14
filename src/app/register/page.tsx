"use client";

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface MemberDetail {
  name: string;
  email: string;
  phone: string;
  year: string;
}

interface TeamData {
  teamName: string;
  domain: string;
  teamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderYear: string;
  college: string;
  members: MemberDetail[];
}

const domains = [
  {
    id: "ai",
    label: "Agentic AI & Intelligent Automation",
    icon: "🤖",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "cyber",
    label: "Cybersecurity & Fintech",
    icon: "🔒",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "blockchain",
    label: "Blockchain / Web3 / IoT",
    icon: "⛓️",
    color: "from-amber-500 to-orange-600",
  },
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationsFull, setRegistrationsFull] = useState(false);
  const [regCount, setRegCount] = useState(0);

  useEffect(() => {
    fetch("/api/register/count")
      .then((res) => res.json())
      .then((data) => {
        setRegCount(data.count || 0);
        if (data.count >= 150) setRegistrationsFull(true);
      })
      .catch(() => {});
  }, []);
  const [teamData, setTeamData] = useState<TeamData>({
    teamName: "",
    domain: "",
    teamSize: 3,
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    leaderYear: "",
    college: "",
    members: [
      { name: "", email: "", phone: "", year: "" },
      { name: "", email: "", phone: "", year: "" },
    ],
  });
  const [transactionId, setTransactionId] = useState("");
  const [txnChecking, setTxnChecking] = useState(false);
  const [txnValid, setTxnValid] = useState<boolean | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkTransactionId = async (txnId: string) => {
    const trimmed = txnId.trim();
    if (!trimmed) return;
    setTxnChecking(true);
    setTxnValid(null);
    try {
      const res = await fetch("/api/register/check-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: trimmed }),
      });
      const data = await res.json();
      setTxnValid(data.valid);
      if (!data.valid) {
        setErrors((prev) => ({ ...prev, transactionId: data.message }));
      }
    } catch {
      // silently fail — server validation will catch it
    } finally {
      setTxnChecking(false);
    }
  };

  const updateTeamData = (field: string, value: any) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...teamData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamData((prev) => ({ ...prev, members: newMembers }));
  };

  const handleTeamSizeChange = (size: number) => {
    const extraMembers = size - 1;
    const currentMembers = [...teamData.members];
    while (currentMembers.length < extraMembers) {
      currentMembers.push({ name: "", email: "", phone: "", year: "" });
    }
    while (currentMembers.length > extraMembers) {
      currentMembers.pop();
    }
    setTeamData((prev) => ({
      ...prev,
      teamSize: size,
      members: currentMembers,
    }));
  };

  const focusFirstError = (newErrors: Record<string, string>) => {
    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      setTimeout(() => {
        const el = document.getElementById(`field-${firstKey}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
        }
      }, 100);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!teamData.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!teamData.domain) newErrors.domain = "Please select a domain";
    if (!teamData.leaderName.trim())
      newErrors.leaderName = "Leader name is required";
    if (!teamData.leaderEmail.trim())
      newErrors.leaderEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(teamData.leaderEmail))
      newErrors.leaderEmail = "Invalid email";
    if (!teamData.leaderPhone.trim())
      newErrors.leaderPhone = "Phone is required";
    else if (!/^\d{10}$/.test(teamData.leaderPhone.replace(/\D/g, "")))
      newErrors.leaderPhone = "Invalid phone (10 digits)";
    if (!teamData.leaderYear) newErrors.leaderYear = "Select year";
    if (!teamData.college.trim())
      newErrors.college = "College name is required";

    teamData.members.forEach((m, i) => {
      if (!m.name.trim()) newErrors[`member_${i}_name`] = "Name required";
      if (!m.email.trim()) newErrors[`member_${i}_email`] = "Email required";
      if (!m.phone.trim()) newErrors[`member_${i}_phone`] = "Phone required";
      if (!m.year) newErrors[`member_${i}_year`] = "Year required";
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      focusFirstError(newErrors);
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!transactionId.trim())
      newErrors.transactionId = "Transaction ID is required";
    if (!screenshot) newErrors.screenshot = "Please upload payment screenshot";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      focusFirstError(newErrors);
      return false;
    }
    return true;
  };

  const goToStep = (target: number) => {
    if (target === 2 && !validateStep1()) return;
    if (target === 4 && !validateStep3()) return;
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          screenshot: "File must be under 5MB",
        }));
        return;
      }
      setScreenshot(file);
      setErrors((prev) => ({ ...prev, screenshot: "" }));
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("teamName", teamData.teamName);
      formData.append("domain", teamData.domain);
      formData.append("teamSize", String(teamData.teamSize));
      formData.append("college", teamData.college);
      formData.append("leaderName", teamData.leaderName);
      formData.append("leaderEmail", teamData.leaderEmail);
      formData.append("leaderPhone", teamData.leaderPhone);
      formData.append("leaderYear", teamData.leaderYear);
      formData.append("transactionId", transactionId);
      formData.append("members", JSON.stringify(teamData.members));
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Registration failed. Please try again.");
        return;
      }

      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ["Team Details", "Payment", "Verification", "Done"];

  return (
    <main className="min-h-screen relative">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Registrations Full Banner */}
          {registrationsFull && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 p-8 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm text-center"
            >
              <div className="text-5xl mb-4">🚫</div>
              <h2 className="text-2xl sm:text-3xl font-[Gilroy-Heavy] text-white mb-3">
                Registrations are <span className="text-red-400">Full!</span>
              </h2>
              <p className="text-gray-300 font-[Gilroy-Medium] mb-2">
                We&apos;ve reached the maximum capacity of{" "}
                <span className="text-primary font-[Gilroy-Bold]">
                  150 teams
                </span>
                .
              </p>
              <p className="text-gray-400 font-[Gilroy-Medium] text-sm">
                Thank you for your interest in VHACK 2.0. Stay tuned for future
                events!
              </p>
              <Link
                href="/"
                className="inline-block mt-6 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-[Gilroy-Bold] hover:bg-primary/20 transition-all duration-300"
              >
                Back to Home
              </Link>
            </motion.div>
          )}

          {/* Header */}
          {!registrationsFull && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-[Gilroy-Heavy] text-white mb-3">
                Register for <span className="gradient-text">VHACK 2.0</span>
              </h1>
              <p className="text-gray-400 font-[Gilroy-Medium]">
                Fill in your team details, complete payment, and you&apos;re in!
              </p>
            </motion.div>
          )}

          {/* Step Indicator */}
          {!registrationsFull && (
            <>
              <div className="step-indicator mb-12 max-w-lg mx-auto">
                {stepLabels.map((label, i) => (
                  <div
                    key={i}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`step-circle ${
                          step > i + 1
                            ? "completed"
                            : step === i + 1
                              ? "active"
                              : ""
                        }`}
                      >
                        {step > i + 1 ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 mt-2 hidden sm:block whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div
                        className={`step-line mx-2 ${step > i + 1 ? "completed" : ""}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Steps */}
              <AnimatePresence mode="wait">
                {/* STEP 1: Team Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 sm:p-10"
                  >
                    <h2 className="text-2xl font-[Gilroy-Bold] text-white mb-2">
                      Team Details
                    </h2>
                    <p className="text-sm text-gray-400 font-[Gilroy-Light] mb-8">
                      Enter your team information to get started.
                    </p>

                    <div className="space-y-6">
                      {/* Team Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Team Name *
                        </label>
                        <input
                          id="field-teamName"
                          type="text"
                          className="form-input"
                          placeholder="e.g., Code Crusaders"
                          value={teamData.teamName}
                          onChange={(e) =>
                            updateTeamData("teamName", e.target.value)
                          }
                        />
                        {errors.teamName && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.teamName}
                          </p>
                        )}
                      </div>

                      {/* Domain Selection */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3">
                          Select Domain *
                        </label>
                        <div
                          id="field-domain"
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                          tabIndex={-1}
                        >
                          {domains.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => updateTeamData("domain", d.id)}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                                teamData.domain === d.id
                                  ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
                              }`}
                            >
                              <span className="text-xs font-bold text-gray-300 leading-tight block">
                                {d.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {errors.domain && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.domain}
                          </p>
                        )}
                      </div>

                      {/* Team Size */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Team Size
                        </label>
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded-xl border border-primary/50 bg-primary/10 text-primary font-bold text-lg flex items-center justify-center">
                            3
                          </div>
                          <p className="text-xs text-gray-500 self-center ml-2">
                            Fixed team size of 3 members (1 leader + 2 members)
                          </p>
                        </div>
                      </div>

                      {/* College */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          College / University *
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          id="field-college"
                          placeholder="e.g., Vignan Institute of Technology and Science"
                          value={teamData.college}
                          onChange={(e) =>
                            updateTeamData("college", e.target.value)
                          }
                        />
                        {errors.college && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.college}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-4 bg-dark-100 text-primary font-bold uppercase tracking-widest">
                            Team Leader
                          </span>
                        </div>
                      </div>

                      {/* Leader Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="field-leaderName"
                            placeholder="John Doe"
                            value={teamData.leaderName}
                            onChange={(e) =>
                              updateTeamData("leaderName", e.target.value)
                            }
                          />
                          {errors.leaderName && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.leaderName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Year *
                          </label>
                          <select
                            id="field-leaderYear"
                            className="form-input"
                            value={teamData.leaderYear}
                            onChange={(e) =>
                              updateTeamData("leaderYear", e.target.value)
                            }
                          >
                            <option value="" className="bg-dark-200">
                              Select Year
                            </option>
                            {years.map((y) => (
                              <option key={y} value={y} className="bg-dark-200">
                                {y}
                              </option>
                            ))}
                          </select>
                          {errors.leaderYear && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.leaderYear}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            className="form-input"
                            id="field-leaderEmail"
                            placeholder="john@example.com"
                            value={teamData.leaderEmail}
                            onChange={(e) =>
                              updateTeamData("leaderEmail", e.target.value)
                            }
                          />
                          {errors.leaderEmail && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.leaderEmail}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            className="form-input"
                            id="field-leaderPhone"
                            placeholder="9876543210"
                            value={teamData.leaderPhone}
                            onChange={(e) =>
                              updateTeamData("leaderPhone", e.target.value)
                            }
                          />
                          {errors.leaderPhone && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.leaderPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Team Members */}
                      {teamData.members.map((member, i) => (
                        <div key={i}>
                          <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="px-4 bg-dark-100 text-secondary font-bold uppercase tracking-widest">
                                Member {i + 2}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-300 mb-2">
                                Full Name *
                              </label>
                              <input
                                id={`field-member_${i}_name`}
                                type="text"
                                className="form-input"
                                placeholder="Member name"
                                value={member.name}
                                onChange={(e) =>
                                  updateMember(i, "name", e.target.value)
                                }
                              />
                              {errors[`member_${i}_name`] && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors[`member_${i}_name`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-300 mb-2">
                                Year *
                              </label>
                              <select
                                id={`field-member_${i}_year`}
                                className="form-input"
                                value={member.year}
                                onChange={(e) =>
                                  updateMember(i, "year", e.target.value)
                                }
                              >
                                <option value="" className="bg-dark-200">
                                  Select Year
                                </option>
                                {years.map((y) => (
                                  <option
                                    key={y}
                                    value={y}
                                    className="bg-dark-200"
                                  >
                                    {y}
                                  </option>
                                ))}
                              </select>
                              {errors[`member_${i}_year`] && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors[`member_${i}_year`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-300 mb-2">
                                Email *
                              </label>
                              <input
                                id={`field-member_${i}_email`}
                                type="email"
                                className="form-input"
                                placeholder="member@example.com"
                                value={member.email}
                                onChange={(e) =>
                                  updateMember(i, "email", e.target.value)
                                }
                              />
                              {errors[`member_${i}_email`] && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors[`member_${i}_email`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-300 mb-2">
                                Phone *
                              </label>
                              <input
                                id={`field-member_${i}_phone`}
                                type="tel"
                                className="form-input"
                                placeholder="9876543210"
                                value={member.phone}
                                onChange={(e) =>
                                  updateMember(i, "phone", e.target.value)
                                }
                              />
                              {errors[`member_${i}_phone`] && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors[`member_${i}_phone`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next Button */}
                    <div className="mt-10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="glow-btn !px-10"
                      >
                        Continue to Payment
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Payment QR */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 sm:p-10"
                  >
                    <h2 className="text-2xl font-[Gilroy-Bold] text-white mb-2">
                      Complete Payment
                    </h2>
                    <p className="text-sm text-gray-400 font-[Gilroy-Light] mb-8">
                      Scan the QR code below to pay the registration fee.
                    </p>

                    {/* Team Summary */}
                    <div className="glass-card !rounded-2xl p-5 mb-8 !border-primary/10 !bg-primary/[0.03]">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg">📋</span>
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                          Team Summary
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Team:</span>
                          <span className="text-white font-bold ml-2">
                            {teamData.teamName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Domain:</span>
                          <span className="text-white font-bold ml-2">
                            {
                              domains.find((d) => d.id === teamData.domain)
                                ?.icon
                            }{" "}
                            {
                              domains.find((d) => d.id === teamData.domain)
                                ?.label
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Leader:</span>
                          <span className="text-white font-bold ml-2">
                            {teamData.leaderName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="text-white font-bold ml-2">
                            {teamData.teamSize} members
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="text-center">
                      <div className="inline-block relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 blur-2xl rounded-3xl" />
                        <div className="relative bg-white rounded-3xl p-6 sm:p-8">
                          {/* Placeholder QR - Replace with actual QR code image */}
                          <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                            <img
                              src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=vhack@upi&pn=VHACK2.0&am=600&cu=INR"
                              alt="Payment QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="mt-4">
                            <p className="text-gray-600 text-sm font-bold">
                              Scan to Pay via UPI
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <span className="text-3xl">💰</span>
                        <div className="text-left">
                          <p className="text-xs font-bold text-green-400/80 uppercase tracking-wider">
                            Amount to Pay
                          </p>
                          <p className="text-3xl font-extrabold text-white">
                            ₹600{" "}
                            <span className="text-sm text-gray-400 font-medium">
                              per team
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <p className="text-sm text-gray-400">
                          <span className="text-yellow-400">⚠️</span> Please
                          note the{" "}
                          <strong className="text-white">Transaction ID</strong>{" "}
                          after payment
                        </p>
                        <p className="text-sm text-gray-400">
                          <span className="text-yellow-400">📸</span> Take a{" "}
                          <strong className="text-white">screenshot</strong> of
                          the payment confirmation
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="outline-btn"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="glow-btn !px-10"
                      >
                        I&apos;ve Paid — Continue
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Transaction Verification */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 sm:p-10"
                  >
                    <h2 className="text-2xl font-[Gilroy-Bold] text-white mb-2">
                      Verify Payment
                    </h2>
                    <p className="text-sm text-gray-400 font-[Gilroy-Light] mb-8">
                      Enter your transaction details so we can confirm your
                      payment.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Transaction ID */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Transaction / UTR ID *
                        </label>
                        <div className="relative">
                          <input
                            id="field-transactionId"
                            type="text"
                            className={`form-input !text-lg !py-4 tracking-wider ${
                              txnValid === true
                                ? "!border-green-500/50"
                                : txnValid === false
                                  ? "!border-red-500/50"
                                  : ""
                            }`}
                            placeholder="e.g., 425619873254"
                            value={transactionId}
                            onChange={(e) => {
                              setTransactionId(e.target.value);
                              setTxnValid(null);
                              setErrors((prev) => ({
                                ...prev,
                                transactionId: "",
                              }));
                            }}
                            onBlur={() => checkTransactionId(transactionId)}
                          />
                          {txnChecking && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                            </div>
                          )}
                          {!txnChecking && txnValid === true && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                          {!txnChecking && txnValid === false && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        {errors.transactionId && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.transactionId}
                          </p>
                        )}
                        {!txnChecking && txnValid === true && (
                          <p className="text-green-400 text-xs mt-1">
                            ✓ Transaction ID is valid
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Found in your UPI app under transaction details /
                          payment history
                        </p>
                      </div>

                      {/* Screenshot Upload */}
                      <div id="field-screenshot" tabIndex={-1}>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                          Payment Screenshot *
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`upload-zone ${screenshot ? "has-file" : ""}`}
                        >
                          {screenshotPreview ? (
                            <div className="flex flex-col items-center gap-4">
                              <img
                                src={screenshotPreview}
                                alt="Payment screenshot"
                                className="max-h-52 rounded-xl object-contain"
                              />
                              <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {screenshot?.name}
                              </div>
                              <p className="text-xs text-gray-500">
                                Click to replace
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-300 mb-1">
                                  Click to upload screenshot
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG up to 5MB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        {errors.screenshot && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.screenshot}
                          </p>
                        )}
                      </div>

                      {/* Submit Error */}
                      {submitError && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          {submitError}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => goToStep(2)}
                          className="outline-btn"
                          disabled={submitting}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16l-4-4m0 0l4-4m-4 4h18"
                            />
                          </svg>
                          Back
                        </button>
                        <button
                          type="submit"
                          className="glow-btn !px-10 !bg-gradient-to-r !from-green-500 !to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Registration
                              <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 4: Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="glass-card p-6 sm:p-10 text-center"
                  >
                    {/* Success animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8"
                    >
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-3xl sm:text-5xl font-[Gilroy-Heavy] text-white mb-3">
                        You&apos;re In! 🎉
                      </h2>
                      <p className="text-gray-400 text-base sm:text-lg font-[Gilroy-Light] mb-8 max-w-md mx-auto">
                        Welcome to VHACK 2.0! Your team has been registered
                        successfully. See you at the hackathon!
                      </p>
                    </motion.div>

                    {/* Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="glass-card !rounded-2xl p-6 mb-8 text-left max-w-md mx-auto !border-green-500/10 !bg-green-500/[0.03]"
                    >
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-center">
                        Registration Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Team</span>
                          <span className="text-white font-bold">
                            {teamData.teamName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Domain</span>
                          <span className="text-white font-bold">
                            {
                              domains.find((d) => d.id === teamData.domain)
                                ?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Leader</span>
                          <span className="text-white font-bold">
                            {teamData.leaderName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Transaction ID</span>
                          <span className="text-white font-bold font-mono">
                            {transactionId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="text-green-400 font-bold">
                            ✓ Registered
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-400">
                        �️ See you on{" "}
                        <strong className="text-white">
                          27–28 February 2026
                        </strong>{" "}
                        at VITS, Hyderabad!
                      </p>
                      <Link href="/" className="glow-btn inline-flex">
                        Back to Home
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
