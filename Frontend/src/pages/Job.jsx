import { getSingleJob, updateHiringStatus } from '@/api/apiJobs'
import ApplicationCard from '@/components/application-card'
import ApplyJobDrawer from '@/components/apply-job'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

function Job() {
  const {isLoaded,user} = useUser()
  const{id} = useParams()

  const{fn:fnJob,data:Job,loading:loadingJob} =useFetch(getSingleJob,{
    job_id : id
  })

  const{fn:fnHiringStatus,loading:loadingHiringStatus} =useFetch(updateHiringStatus,{
    job_id : id
  })

  const handleStatusChange=(value)=>{
      console.log("Dropdown changed to:", value);
      const isOpen = value === "open"
      console.log("is Open hai:", isOpen);
      fnHiringStatus(isOpen).then(()=>fnJob())
  }

  useEffect(()=>{
    if(isLoaded) fnJob()
  },[isLoaded])

   if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  
  return (
    <div className="flex flex-col gap-8 mt-5">
    <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
      <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{Job?.title}</h1>
      <img src={Job?.company?.logo_url} className="h-12" alt={Job?.title} />
    </div>

    <div className="flex justify-between">
      <div className="flex gap-2">
          <MapPinIcon /> {Job?.location}
      </div>
      <div className="flex gap-2">
          <Briefcase /> {Job?.applications?.length} Applicants
      </div>
      <div className="flex gap-2">
          {Job?.is_Open ? (<><DoorOpen /> Open</>) :(<><DoorClosed />Closed</>)}
      </div>
    </div>

    {/* hiring status  */}
    {loadingHiringStatus && <BarLoader width={"100%"} color='#36d7d7' />}
    {Job?.recruiter_id.replace(/"/g, "") === user?.id && (
      <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${Job?.is_Open ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue placeholder={"Hiring Status" + (Job?.is_Open ? "(Open)" : "(Closed)")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open" >Open</SelectItem>
            <SelectItem value="closed" >Closed</SelectItem>
          </SelectContent>
        </Select>
    )}

    <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
    <p className="sm:text-lg">{Job?.description}</p>
    <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
    </h2>
    <div data-color-mode="dark">
    <MDEditor.Markdown 
      source={Job?.requirements}
      className="bg-transparent sm:text-lg"
      />
      </div>
    {/* render applications  */}
    {Job?.recruiter_id.replace(/"/g, "") !== user?.id && (<ApplyJobDrawer 
    job={Job}
    user={user}
    fetchJob = {fnJob}
    applied={Job?.applications?.find((ap)=>ap.candidate_id === user.id)}
    />)}

    {Job?.recruiter_id.replace(/"/g, "") === user?.id && Job?.applications?.length > 0 && (
      <div className="flex flex-col gap-2">
        <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
        {Job?.applications.map((application)=>{
          return (<ApplicationCard key={application.id} application={application} />)
        })}
      </div>
    )}
    </div>
  )
}

export default Job
