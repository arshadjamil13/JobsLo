import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function getCompanies(token){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase
    .from("companies")
    .select("*")

  if (error) {
    console.error("Error Fetching companies:", deleteError);
    return null;
  }
  console.log(data)

  return data
}

export async function addNewCompany(token,_,companyData){
  const supabase = await createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const {error: storageError} = await supabase.storage.from("company-logo").upload(fileName,companyData.logo)

  if (storageError) throw new Error("Error uploading Company Logo");
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([{
      name: companyData.name,
      logo_url : logo_url
    }])
    .select()

  if (error) {
    console.error("Error Submitting Company:", error);
    return null;
  }
  console.log(data)

  return data
}