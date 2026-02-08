import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function getJobs(token,{location,company_id,searchQuery}){
    const supabase = await createClient(supabaseUrl,supabaseAnonKey,{
        global:{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    });

    let query = supabase.from("jobs").select("*,saved: saved_jobs(id),company : companies(name,logo_url)");
    if(location){
        query = query.eq("location",location)
    }
    if(company_id){
        query = query.eq("company_id",company_id)
    }if(searchQuery){
        query = query.ilike("title",`%${searchQuery}%`)
    }

  const {data, error} = await query;

    if(error){
        console.error("Error Fetching Jobs:",error)
        return null
    }

    return data

}

export async function saveJob(token,{alreadySaved},saveData){
    const supabase = await createClient(supabaseUrl,supabaseAnonKey,{
        global:{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    });

    if(alreadySaved){
        const {data, error : deleteError} = await supabase.from("saved_jobs")
        .delete()
        .eq("job_id",saveData.job_id)

        if(deleteError){
            console.error("Error Deleting Saved Jobs:",deleteError)
            return null
        }

        return data
    }else{
        const {data, error : InsertError} = await supabase.from("saved_jobs")
        .insert([saveData])
        .select()

        if(InsertError){
            console.error("Error Inserting Saved Jobs:",InsertError)
            return null
        }

        return data
    }
   

}

export async function getSingleJob(token,{job_id}){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company : companies(name,logo_url), applications:applications(*)")
    .eq("id",job_id)
    .single()

  if (error) {
    console.error("Error Fetching Company:", error);
    return null;
  }
  

  return data
}

export async function updateHiringStatus(token,{job_id},is_Open){
    console.log("TOKEN:", token);
  console.log("Job id:", job_id);
  console.log("IS_OPEN:", is_Open);
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("jobs")
    .update({is_Open})
    .eq("id",job_id)
    .select()

  if (error) {
    console.error("Error Updating Job:", error);
    return null;
  }
  

  return data
}

export async function getSavedJobs(token){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*,job:jobs(*,company : companies(name,logo_url))")

  if (error) {
    console.error("Error fetching Saved Jobs :", error);
    return null;
  }
  console.log(data)

  return data
}

export async function getMyJobs(token,{recruiter_id}){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("jobs")
    .select("*,company : companies(name,logo_url)")
    .eq("recruiter_id",recruiter_id)

  if (error) {
    console.error("Error fetching  Jobs :", error);
    return null;
  }
  console.log(data)

  return data
}

export async function deleteJob(token,{job_id}){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id",job_id)
    .select()

  if (error) {
    console.error("Error Deleting  Jobs :", error);
    return null;
  }
  console.log(data)

  return data
}