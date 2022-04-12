<template>
	<div>
		<ul class="nav nav-tabs" role="tablist">
			<li class="nav-item">
				<a class="nav-link active" href="#running-jobs" role="tab" data-toggle="tab" aria-selected="true">Running jobs</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="#finished-jobs" role="tab" data-toggle="tab">Finished jobs</a>
			</li>
		</ul>

		<!-- Tab panes -->
		<div class="tab-content" style="padding-top: 10px;">
			<div role="tabpanel" class="tab-pane active" id="running-jobs">
				<div class="card shadow mb-4">
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-bordered dataTable" id="jobs-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
							
								<thead>
									<tr role="row">
										<th>#</th>
										<th>JobId</th>
										<th>Job name</th>
										<th>TaskId</th>
										<th>App</th>
										<th>Start time</th>
										<th>End time</th>
										<th>Job status</th>
										<th>Consumed credits</th>
										<th>Reserved credits</th>
										<th>Progress</th>
										<th></th>
									</tr>
								</thead>

								<tbody>
									<tr role="row" class="job" v-for="job in runningJobs" v-bind:key="job._id" :id="job._id">
										<td>{{ job.nr }}</td>
										
										<td>
											<router-link :to="{ name: 'JobDetails', params: {id: job._id } }">
												{{ job._id }}
											</router-link>
										</td>
										<td>{{ job.name }}</td>
										<td>
											<router-link :to="{ name: 'TaskDetails', params: {id: job.taskId } }">
												{{ job.taskId }}
											</router-link>
										</td>
										<td>
											<router-link :to="{ name: 'AppDetails', params: {id: job.appId } }">
												{{ job.appName }}
											</router-link>
										</td>
										<td>{{ job.startTime }}</td>
										<td>{{ job.endTime }}</td>

										<td>{{ job.jobStatus }}</td>
										<td>{{ job.consumedCredits }}</td>
										<td>{{ job.reservedCredits }}</td>
										<td>{{ job.progress }}</td>									
										<td>
											<a href="#" v-on:click="removeJob">
												<i class="d-flex justify-content-center fas fa-trash"></i>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="tab-pane fade" id="finished-jobs">
				<div class="card shadow mb-4">
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-bordered dataTable" id="jobs-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">

								<thead>
									<tr role="row">
										<th>#</th>
										<th>JobId</th>
										<th>Job name</th>
										<th>TaskId</th>
										<th>App</th>
										<th>Start time</th>
										<th>End time</th>
										<th>Job status</th>
										<th>Consumed credits</th>
										<th>Reserved credits</th>
										<th>Progress</th>
									</tr>
								</thead>

								<tbody>
									<tr role="row" class="job" v-for="job in finishedJobs" v-bind:key="job._id" :id="job._id">
										<td>{{ job.nr }}</td>
										
										<td>
											<router-link :to="{ name: 'JobDetails', params: {id: job._id } }">
												{{ job._id }}
											</router-link>
										</td>
										<td>{{ job.name }}</td>
										<td>
											<router-link :to="{ name: 'TaskDetails', params: {id: job.taskId } }">
												{{ job.taskId }}
											</router-link>
										</td>
										<td>
											<router-link :to="{ name: 'AppDetails', params: {id: job.appId } }">
												{{ job.appName }}
											</router-link>
										</td>
										<td>{{ job.startTime }}</td>
										<td>{{ job.endTime }}</td>

										<td>{{ job.jobStatus }}</td>
										<td>{{ job.consumedCredits }}</td>
										<td>{{ job.reservedCredits }}</td>
										<td>{{ job.progress }}</td>

									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./Jobs.js"></script>