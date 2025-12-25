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

export default function RecoverUser({name}:{name:string}) {

    const {
    username,
    password,
    adminKey,
    setUsername,
    setPassword,
    setAdminKey,
    recover,
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
              Enter the Lost Username for your account.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <Input id="password" type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Admin Key</FieldLabel>
            <FieldDescription>
              {/* Repeat your password. */}
            </FieldDescription>
            <Input id="adminKey" type="password" 
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)} 
            placeholder="••••••••" required />
          </Field>

            <Button variant="outline" 
                onClick={()=> recover()}
                disabled={loading}
                type="submit" >
                Submit
            </Button>
        </FieldGroup>
        <AuthNavBar active="recover"/>
      </FieldSet>
    </div>
  )
}
