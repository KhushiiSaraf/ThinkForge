import { useState } from "react"
import { createOrder, verifyPayment } from "../services/payment.api"
import { toast } from "react-toastify"

export const usePayment = () => {
    const [loading, setLoading] = useState(false)

    const handlePayment = async (user, onSuccess) => {
        setLoading(true)
        try {
            // Step 1 — create order on backend
            const data = await createOrder()
            if (!data?.order) {
                toast.error('Failed to initiate payment')
                return
            }

            // Step 2 — open Razorpay popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'ThinkForge',
                description: 'Pro Plan - ₹999/month',
                order_id: data.order.id,
                handler: async (response) => {
                    // Step 3 — verify payment on backend
                    const result = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    })

                    if (result?.message) {
                        toast.success('Payment successful! Welcome to Pro 🎉')
                        if (onSuccess) onSuccess()
                    } else {
                        toast.error('Payment verification failed')
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#0f172a'
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            toast.error('Payment failed')
        } finally {
            setLoading(false)
        }
    }

    return { loading, handlePayment }
}