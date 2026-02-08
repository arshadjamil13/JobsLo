
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function applyToJob(token,_,jobData){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`
  const{error:storageError}=await supabase.storage.from("resumes").upload(fileName,jobData.resume)
  if (storageError) {
    console.error("Error Uploading Resume:", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`

  const { data, error } = await supabase
    .from("applications")
    .insert([{...jobData,resume}])
    .select()

  if (error) {
    console.error("Error Inserting Applications:", error);
    return null;
  }
  console.log(data)

  return data
}

export async function updateApplicationStatus(token,{job_id},status){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("applications")
    .update({status})
    .eq("job_id",job_id)
    .select()

  if (error ||data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }
  console.log(data)

  return data
}

export async function addNewJob(token,_,jobData){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select()

  if (error) {
    console.error("Error Creating Application :", error);
    return null;
  }
  console.log(data)

  return data
}

export async function getApplications(token,{user_id}){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications :", error);
    return null;
  }
  console.log(data)

  return data
}