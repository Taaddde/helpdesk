import { Routes } from "@angular/router";

import { AnalyticsComponent } from "./analytics/analytics.component";

export const AnalyticsRoutes: Routes = [
  {
    path: ":company",
    component: AnalyticsComponent,
    data: { title: "TICKETS", breadcrumb: "TICKETS" }
  },
];
