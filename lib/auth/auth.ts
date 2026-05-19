// import { supabase } from "./client";

import { supabase } from "../supabase/client";

export async function signUp({ email, username, password, store_id }:{
    email: string;
    username: string;
    password: string;
    store_id: string | undefined;
}) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  // Add username to profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user?.id,
    username,
    email,
    store_id,
  });

  if (profileError) throw profileError;

  return data.user;
}


export async function login({ username, password }:{
    username: string;
    password: string;
}) {

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .or(`username.eq.${username},email.eq.${username}`) 
    .single();

  if (!profile) throw new Error("User not found");

  // Use email to login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password
  });

  if (error) throw error;

  return data.user;
}



