"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function LangToggle() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size='icon'
					className='rounded-md'>
					<span className='sr-only'>Toggle language</span>
					<p>EN</p>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-max'>
				<DropdownMenuItem
					asChild
					className='cursor-pointer'>
					<Link href='/tr'>
						<p>TR</p>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					asChild
					className='cursor-pointer'>
					<Link href='/en'>
						<p>EN</p>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
