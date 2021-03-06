import React from "react";

import { Circle } from "@/app/components/Circle";
import { Skeleton } from "@/app/components/Skeleton";

export const WalletVoteSkeleton = () => (
	<div data-testid="WalletVote__skeleton" className="flex items-center w-full">
		<Circle size="lg" className="mr-4 border-transparent" shadowClassName="ring-theme-secondary-background">
			<Skeleton circle height={44} width={44} />
		</Circle>

		<div className="flex flex-col justify-between h-10">
			<Skeleton height={14} width={100} />
			<Skeleton height={16} width={150} />
		</div>

		<div className="ml-auto">
			<Skeleton height={44} width={100} />
		</div>
	</div>
);
