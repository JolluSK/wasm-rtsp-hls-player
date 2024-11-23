import React from 'react'
import Layout from '@/app/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
]

export default function DashboardPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
    ]

    return (
        <Layout breadcrumbItems={breadcrumbItems}>
            <h1 className="text-2xl font-semibold text-foreground mb-4">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" />
                <DashboardCard title="Active Users" value="+2350" change="+180.1% from last month" />
                <DashboardCard title="Sales" value="+12,234" change="+19% from last month" />
                <DashboardCard title="Active Now" value="+573" change="+201 since last hour" />
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <h1>Hello</h1>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}

function DashboardCard({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{change}</p>
            </CardContent>
        </Card>
    )
}

