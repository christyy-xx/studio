"use client";

import { useState, useMemo } from 'react';
import type { Candidate } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SortKey = keyof Candidate | 'resumeScore';
type SortDirection = 'asc' | 'desc';

const statusColors: { [key in Candidate['status']]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  'Shortlisted': 'secondary',
  'Interviewing': 'default',
  'Offered': 'outline',
  'Hired': 'default',
  'Rejected': 'destructive',
};

export function CandidatesTable({ candidates }: { candidates: Candidate[] }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === undefined || bValue === undefined) return 0;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [candidates, filter, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ChevronDown className="h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Name <SortIcon columnKey="name" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-center" onClick={() => handleSort('resumeScore')}>
                <div className="flex items-center justify-center gap-2">
                  Resume Score <SortIcon columnKey="resumeScore" />
                </div>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredCandidates.length > 0 ? (
              sortedAndFilteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{candidate.resumeScore}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusColors[candidate.status]}>{candidate.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No candidates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
