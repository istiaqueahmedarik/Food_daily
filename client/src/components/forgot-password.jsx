'use client'

import { useState } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import emailjs from '@emailjs/browser'
import { post } from '@/action'
import { toast } from './ui/use-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [step, setStep] = useState('email')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)

    try {
      const result = await emailjs.send(
        'service_nsfwyrb',
        'template_51cdmph',
        { email: email, otp: newOtp },
        '-5Yq0qod4i_9g_tOj'
      )

      if (result.text === 'OK') {
        setMessage({ type: 'success', text: 'OTP sent to your email. Please check and enter it below.' })
        setStep('otp')
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = () => {
    if (otp === generatedOtp) {
      setMessage({ type: 'success', text: 'OTP verified successfully. You can now reset your password.' })
      setIsModalOpen(true)
    } else {
      setMessage({ type: 'error', text: 'Invalid OTP. Please try again.' })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match. Please try again.' })
      return
    }

    setIsLoading(true)
    try {
      

      const res = await post('reset-pass', { email, pass: newPassword });
      if (res.status) {
        setMessage({ type: 'success', text: 'Password reset successfully. You can now log in with your new password.' })
        toast.success('Password reset successfully. You can now log in with your new password.')
      } else {
        setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' })
      }
      
      setIsModalOpen(false)
      setStep('email')
      setEmail('')
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Enter your email to receive an OTP.'
              : 'Enter the OTP sent to your email.'}
          </CardDescription>
        </CardHeader>
        {step === 'email' ? (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button3 className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button3>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="otp">Enter OTP</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button3 onClick={handleVerifyOTP} className="w-full">
                Verify OTP
              </Button3>
            </div>
          </CardContent>
        )}
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mt-4">
            <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button3 type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button3>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}