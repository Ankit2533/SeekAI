"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Form from "@/components/Form";

const UpdatePrompt = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");
  
    const { data: session, status } = useSession();
  
    const [post, setPost] = useState({ prompt: "", tag: "" });
    const [submitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      const getPromptDetails = async () => {
        try {
          const response = await fetch(`/api/prompt/${promptId}`);
          const data = await response.json();
  
          setPost({
            prompt: data.prompt,
            tag: data.tag,
          });
        } catch (error) {
          console.log(error);
        }
      };
  
      if (promptId) getPromptDetails();
    }, [promptId]);
  
    const updatePrompt = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      if (!promptId) return alert("Missing PromptId!");
  
      try {
        const newresponse = await fetch(`/api/prompt/${promptId}`);
        const newdata = await newresponse.json();
        
        if(session?.user.id !== newdata.creator._id){
            throw new Error("You are not the owner of this prompt.");
        }
        if (!session) {
          console.log("User not authenticated. Redirecting to login.");
          router.push("/login"); 
          return;
        }
  
        const response = await fetch(`/api/prompt/${promptId}`, {
          method: "PATCH",
          body: JSON.stringify({
            prompt: post.prompt,
            tag: post.tag,
          }),
        });
  
        if (response.ok) {
          router.push("/");
        } else {
          console.log("Failed to update prompt:", response.status);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Check if the user session is still loading
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        {session ? (
          // Render the form if the user is authenticated
          <Form
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
          />
        ) : (
          // Render a message or redirect the user if not authenticated
          <div>
            Please log in to edit this prompt.
            {/* Alternatively, you can redirect to the login page */}
          </div>
          
        )}
      </>
    );
  };
  
  export default UpdatePrompt;