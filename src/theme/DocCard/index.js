import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
	useDocById,
	findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import { usePluralForm } from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import {
	FolderIcon,
	FileTextIcon,
	LinkIcon,
} from '@site/src/components/LucideIcons';

import styles from './styles.module.css';

function useCategoryItemsPlural() {
	const { selectMessage } = usePluralForm();
	return (count) =>
		selectMessage(
			count,
			translate(
				{
					message: '1 item|{count} items',
					id: 'theme.docs.DocCard.categoryDescription.plurals',
					description:
						'The default description for a category card in the generated index about how many items this category includes',
				},
				{ count },
			),
		);
}

function CardContainer({ href, children }) {
	return (
		<Link
			href={href}
			className={clsx('card padding--lg', styles.cardContainer)}
		>
			{children}
		</Link>
	);
}

function CardLayout({ href, icon, title, description }) {
	return (
		<CardContainer href={href}>
			<Heading
				as="h2"
				className={clsx('text--truncate', styles.cardTitle)}
				title={title}
			>
				<span className={styles.cardIcon} aria-hidden="true">
					{icon}
				</span>
				{title}
			</Heading>
			{description && (
				<p
					className={clsx('text--truncate', styles.cardDescription)}
					title={description}
				>
					{description}
				</p>
			)}
		</CardContainer>
	);
}

function CardCategory({ item }) {
	const href = findFirstSidebarItemLink(item);
	const categoryItemsPlural = useCategoryItemsPlural();

	if (!href) {
		return null;
	}

	return (
		<CardLayout
			href={href}
			icon={<FolderIcon size={22} />}
			title={item.label}
			description={item.description ?? categoryItemsPlural(item.items.length)}
		/>
	);
}

function CardLink({ item }) {
	const icon = isInternalUrl(item.href) ? (
		<FileTextIcon size={22} />
	) : (
		<LinkIcon size={22} />
	);
	const doc = useDocById(item.docId ?? undefined);
	return (
		<CardLayout
			href={item.href}
			icon={icon}
			title={item.label}
			description={item.description ?? doc?.description}
		/>
	);
}

export default function DocCard({ item }) {
	switch (item.type) {
		case 'link':
			return <CardLink item={item} />;
		case 'category':
			return <CardCategory item={item} />;
		default:
			throw new Error(`unknown item type ${JSON.stringify(item)}`);
	}
}
