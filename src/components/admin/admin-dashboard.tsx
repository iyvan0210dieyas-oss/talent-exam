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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, ShieldX, RefreshCw } from 'lucide-react';
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
  onClearSubmissions: () => Promise<void>;
};

export default function AdminDashboard({ submissions, onClearSubmissions }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearResults = async () => {
    setIsClearing(true);
    try {
      await onClearSubmissions();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl animate-slide-in-up">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>📊 Admin Dashboard — Student Results</CardTitle>
            <CardDescription className="mt-1">
              {submissions.length === 0
                ? 'No submissions yet. Results will appear here in real-time as students complete the exam.'
                : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''} — updates automatically as new students submit.`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin-slow" />
            <span>Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isClearing || submissions.length === 0}>
                <Trash2 className="mr-1 h-4 w-4" />
                {isClearing ? 'Clearing…' : 'Clear All Results'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {submissions.length} student quiz result{submissions.length !== 1 ? 's' : ''} from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearResults}>Yes, clear all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                    No results yet. Waiting for student submissions…
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub, idx) => (
                  <TableRow key={sub.id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{sub.user.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{sub.user.email}</TableCell>
                    <TableCell>{sub.user.course}</TableCell>
                    <TableCell>{sub.attempt}</TableCell>
                    <TableCell>
                      <span className={sub.finalScore / sub.totalQuestions >= 0.5 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                        {sub.finalScore}/{sub.totalQuestions}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.timestamp}</TableCell>
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
