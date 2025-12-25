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
import AuthNavBar from "../../layout/AuthNav";

export default function SignUp({name}:{name:string}) {

    const {
    username,
    password,
    repassword,
    adminKey,
    setUsername,
    setPassword,
    setRePassword,
    setAdminKey,
    signup,
    loading,
  } = useAuthStore()

  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <h1 className="font-bold text-3xl">{name}</h1>
        <FieldGroup>
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
          <Field>
            <FieldLabel htmlFor="password">Repeat Password</FieldLabel>
            <FieldDescription>
              Repeat your password.
            </FieldDescription>
            <Input id="repassword" type="password" 
            value={repassword}
            onChange={(e) => setRePassword(e.target.value)} 
            placeholder="••••••••" required />
          </Field>
          
          <Field>
            <FieldLabel htmlFor="password">Admin Key</FieldLabel>
            <Input id="adminKey" type="password" 
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)} 
            placeholder="••••••••" required />
          </Field>

            <Button variant="outline" 
                onClick={()=> signup()}
                disabled={loading}
                type="submit" >
                Submit
            </Button>
        </FieldGroup>
        <AuthNavBar active="register"/>
      </FieldSet>
    </div>
  )
}
