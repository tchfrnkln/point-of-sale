"use client"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "../../ui/button"
import { useAuthStore } from "@/store/auth.store";

export default function SignUp({name}:{name:string}) {

    const {
    email,
    username,
    password,
    setEmail,
    setUsername,
    setPassword,
    signup,
    loading,
  } = useAuthStore()

  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <h1 className="font-bold text-3xl">{name}</h1>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="repassword" type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="mail@gmail.com" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" type="text" placeholder="Max Leiter" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required/>
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <Input id="password" type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" required />
          </Field>

            <Button variant="outline" 
                onClick={()=> signup()}
                disabled={loading}
                type="submit" >
                Submit
            </Button>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
