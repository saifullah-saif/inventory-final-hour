"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, UserPlus, Edit, Trash2, ShieldCheck, ShieldX, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      department: "Operations",
      status: "active",
      lastLogin: "2023-07-20 09:15 AM",
    },
    {
      id: 2,
      name: "John Manager",
      email: "john@example.com",
      role: "manager",
      department: "Inventory",
      status: "active",
      lastLogin: "2023-07-19 02:30 PM",
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "manager",
      department: "Sales",
      status: "active",
      lastLogin: "2023-07-18 11:45 AM",
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael@example.com",
      role: "manager",
      department: "Purchasing",
      status: "inactive",
      lastLogin: "2023-07-10 10:20 AM",
    },
    {
      id: 5,
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "manager",
      department: "Customer Service",
      status: "active",
      lastLogin: "2023-07-20 08:05 AM",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "manager",
    department: "",
    password: "",
    confirmPassword: "",
  })

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchValue = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.role.toLowerCase().includes(searchValue) ||
      user.department.toLowerCase().includes(searchValue) ||
      user.status.toLowerCase().includes(searchValue) ||
      user.lastLogin.toLowerCase().includes(searchValue)
    )
  })

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Clear any existing timeout to implement debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set a new timeout for search to reduce performance impact during typing
    const timeout = setTimeout(() => {
      // In a real app, this could trigger an API call for server-side search
      console.log("Searching users:", value)
    }, 300)

    setSearchTimeout(timeout)
  }

  const openAddUserDialog = () => {
    setNewUser({
      name: "",
      email: "",
      role: "manager",
      department: "",
      password: "",
      confirmPassword: "",
    })
    setIsAddUserDialogOpen(true)
  }

  const openEditUserDialog = (user) => {
    setSelectedUser({
      ...user,
      password: "",
      confirmPassword: "",
    })
    setIsEditUserDialogOpen(true)
  }

  const confirmDeleteUser = (user) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectedUserChange = (e) => {
    const { name, value } = e.target
    setSelectedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field, value, isNewUser = true) => {
    if (isNewUser) {
      setNewUser((prev) => ({ ...prev, [field]: value }))
    } else {
      setSelectedUser((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()

    // Validate form
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Password and confirmation password must match.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new user to state
      const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
      const userToAdd = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: "active",
        lastLogin: "Never",
      }

      setUsers([...users, userToAdd])

      // Show success toast
      toast({
        title: "User added",
        description: `${newUser.name} has been added successfully.`,
      })

      // Close dialog
      setIsAddUserDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()

    // Validate form
    if (!selectedUser.name || !selectedUser.email || !selectedUser.department) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    if (selectedUser.password && selectedUser.password !== selectedUser.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Password and confirmation password must match.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                department: selectedUser.department,
                status: selectedUser.status,
              }
            : user,
        ),
      )

      // Show success toast
      toast({
        title: "User updated",
        description: `${selectedUser.name}'s information has been updated.`,
      })

      // Close dialog
      setIsEditUserDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove user from state
      setUsers(users.filter((user) => user.id !== userToDelete.id))

      // Show success toast
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been removed successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const toggleUserStatus = async (user) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user status in state
      const newStatus = user.status === "active" ? "inactive" : "active"
      setUsers(
        users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: newStatus,
              }
            : u,
        ),
      )

      // Show success toast
      toast({
        title: `User ${newStatus === "active" ? "activated" : "deactivated"}`,
        description: `${user.name}'s account has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${user.status === "active" ? "deactivate" : "activate"} user. Please try again.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their permissions</CardDescription>
          </div>
          <Button onClick={openAddUserDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Administrator" : "Manager"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "success" : "secondary"}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                              {user.status === "active" ? (
                                <>
                                  <ShieldX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => confirmDeleteUser(user)}
                              disabled={user.role === "admin"}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate permissions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" name="name" value={newUser.name} onChange={handleNewUserChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      value={newUser.department}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <form onSubmit={handleUpdateUser}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={selectedUser.name}
                      onChange={handleSelectedUserChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedUser.email}
                      onChange={handleSelectedUserChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select
                        value={selectedUser.role}
                        onValueChange={(value) => handleSelectChange("role", value, false)}
                        disabled={selectedUser.id === 1} // Prevent changing the main admin role
                      >
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-department">
                        Department <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-department"
                        name="department"
                        value={selectedUser.department}
                        onChange={handleSelectedUserChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedUser.status}
                      onValueChange={(value) => handleSelectChange("status", value, false)}
                      disabled={selectedUser.id === 1} // Prevent changing the main admin status
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-password">
                      New Password <span className="text-muted-foreground text-sm">(leave blank to keep current)</span>
                    </Label>
                    <Input
                      id="edit-password"
                      name="password"
                      type="password"
                      value={selectedUser.password}
                      onChange={handleSelectedUserChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
                    <Input
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={selectedUser.confirmPassword}
                      onChange={handleSelectedUserChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user <span className="font-medium">{userToDelete?.name}</span>. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
