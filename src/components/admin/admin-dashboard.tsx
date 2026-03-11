"use client";

import { useState } from 'react';
import type { Submission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShieldX, LogOut } from 'lucide-react';
import AdminResponseDialog from './admin-response-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AdminDashboardProps = {
  submissions: Submission[];
  setSubmissions: (submissions: Submission[]) => void;
};

export default function AdminDashboard({ submissions, setSubmissions }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleClearResults = () => {
    setSubmissions([]);
    localStorage.removeItem('submissions');
  };

  const handleClearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-5xl animate-slide-in-up">
      <CardHeader>
        <CardTitle>📊 Admin Dashboard - Student Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 />Clear Results</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all student quiz results. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearResults}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-purple-600 hover:bg-purple-700"><ShieldX />Clear All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>DANGER: Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear EVERYTHING from local storage, including results and attempts count. This is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Yes, delete all data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                    No results yet.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.user.name}</TableCell>
                    <TableCell>{sub.user.course}</TableCell>
                    <TableCell>{sub.attempt}</TableCell>
                    <TableCell>{sub.finalScore}/{sub.totalQuestions}</TableCell>
                    <TableCell>{sub.timestamp}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(sub)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedSubmission && (
          <AdminResponseDialog
            submission={selectedSubmission}
            isOpen={!!selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
