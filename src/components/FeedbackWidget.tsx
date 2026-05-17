import React, { useState } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "user_feedback"), {
        content: feedback,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setFeedback("");
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] md:w-[350px] mb-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-yellow-500" />
                Give Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-700 rounded-full transition-colors text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {submitted ? (
                <div className="py-8 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <p className="text-white font-medium">Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-neutral-400">
                    Your feedback helps us improve Multimedia Hub. If you run into issues, let us know here!
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think or report a bug..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 text-white rounded-xl p-3 text-sm outline-none transition-colors placeholder:text-neutral-600 min-h-[100px] resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!feedback.trim() || isSubmitting}
                    className="w-full py-2.5 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-30 hover:opacity-100 focus-within:opacity-100'}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Feedback</span>
        </button>
      </div>
    </div>
  );
}
