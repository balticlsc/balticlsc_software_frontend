<template>
	<div>
		<div>
			<p>job id  {{job.id}} </p>
			<p>job name  {{job.name}} </p>
			<p>task  {{job.clusterId}} </p>
			<p>computationModuleName  {{job.computationModuleName}} </p>
			<p>computationModuleReleaseId  {{job.computationModuleReleaseId}} </p>
			<p>computationTaskId  {{job.computationTaskId}} </p>
			<p>startTime {{job.startTime}} </p>
			<p>endTime {{job.endTime}} </p>
			<p>estimatedCredits  {{job.estimatedCredits}} </p>
			<p>progress  {{job.progress}} </p>
			<p>usedCredits  {{job.usedCredits}} </p>
			<p>status  {{job.status}} </p>
		</div>

		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="m-0 font-weight-bold text-primary">Resource usage matrics</h6>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-bordered dataTable" id="tasks-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
					
						<thead>
							<tr role="row">
								<th>MachineId</th>
								<th>ResourceType</th>
								<th>Value</th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="cluster" v-for="resource in job.resourceUsageMetrics" v-bind:key="resource.machineId" :id="resource.machineId">
								<td>{{ resource.machineId }}</td>
								<td>{{ resource.resourceType }}</td>
								<td>{{ resource.value }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./JobDetails.js"></script>
