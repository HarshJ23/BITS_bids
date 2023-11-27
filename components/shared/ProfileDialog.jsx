import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function ProfileDialog({userData}) {

const router = useRouter();

const EditProfileRoute = ()=>{

    router.push(`/profile/editProfile/${userData.email}`)
}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Profile Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
          <DialogDescription>
            See your profle details here.Click "Edit Profile" to change profile details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Username" className="text-right">
              Username
            </Label>
            <Input
              id="Username"
              defaultValue={userData.name}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue={userData.email}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hostel" className="text-right">
              Hostel
            </Label>
            <Input
              id="hostel"
              defaultValue={userData.address}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              defaultValue={userData.phoneNumber}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
           
          <Button type="submit" onClick={EditProfileRoute}>Edit Profile</Button>
            
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
