<template>
	<div>
		<div class="d-sm-flex align-items-center justify-content-between mb-4">
			<h1 class="h3 mb-0 text-gray-800"><span v-if="task.loading">Loading ...</span>{{task.parameters.taskName}}</h1>
			<p>({{task._status}}, {{task._start}} - {{task._finish}})  
			<button type="button" class="btn btn-link btn-sm" @click="refresh()">Refresh</button>
			</p>			
		</div>

		<div class="card shadow mb-4">
			<div class="card-body">
				<div class="row">
					<div class="col-md-6">
						<div class="row">
							<div class="col-md-4">
								<p style="margin-bottom: 0px;">Reserved credits: {{task.parameters.reservedCredits}}</p>
								<p style="margin-bottom: 0px;">AuxStorageCredits: {{task.parameters.auxStorageCredits}}</p>
							</div>
							<div class="col-md-4">
								<p style="margin-bottom: 0px;">Priority: {{task.parameters.priority}}</p>
								<p style="margin-bottom: 0px;">IsPrivate: {{task._private}}</p>
							</div>
							<div class="col-md-4">
								<p style="margin-bottom: 0px;">ClusterAllocation: {{task.parameters.clusterAllocation}}</p>
								<p style="margin-bottom: 0px;">Status: {{task._status}}</p>
							</div>
						</div>
					</div>

					<div class="col-md-6">
						<div class="row">
							<div class="col-md-3">
								<p style="margin-bottom: 0px;">Min Memory: {{task.parameters.minMemory}}</p>
								<p style="margin-bottom: 0px;">Max Memory: {{task.parameters.maxMemory}}</p>
							</div>

							<div class="col-md-2">
								<p style="margin-bottom: 0px;">Min Storage: {{task.parameters.minStorage}}</p>
								<p style="margin-bottom: 0px;">Max Storage: {{task.parameters.maxStorage}}</p>
							</div>

							<div class="col-md-2">
								<p style="margin-bottom: 0px;">Min CPU: {{task.parameters.minCPUs}}</p>
								<p style="margin-bottom: 0px;">Max CPU: {{task.parameters.maxCPUs}}</p>
							</div>

							<div class="col-md-2">
								<p style="margin-bottom: 0px;">Min GPU: {{task.parameters.minGPUs}}</p>
								<p style="margin-bottom: 0px;">Max GPU: {{task.parameters.maxGPUs}}</p>
							</div>

							<div class="col-md-3">
								<p style="margin-bottom: 0px;">FH Policy: {{task._fhPolicy}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="card shadow mb-4" v-for="batch in task.batches" v-bind:key="batch.batchMsgUid">

			<div class="card-header py-3">

				<div class="row">
					<div class="col-md-4"><h6 class="m-0 font-weight-bold text-primary"><span class="text-success">{{batch._status}}</span>
					Batch: {{batch.uid}} </h6></div>
					<div class="col-md-8">
						<p style="margin-bottom:0px;">{{batch.tokensProcessed}} of {{batch.tokensReceived}} tokens processed in {{batch.batches.length}} batch messages.
						<button type="button" data-toggle="collapse" :data-target="'#id_' + batch.uid" aria-expanded="false" :aria-controls="batch.uid" class="float-right btn btn-info btn-circle btn-sm"><i class="fas fa-angle-double-down"></i></button></p>
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
						<p style="margin-bottom:0px;">Consumed credits: {{batch.consumedCredits}} </p>
					</div>
					<div class="col-md-2">
						<p style="margin-bottom:0px;">Node: {{batch.node}}</p>
					</div>
					<div class="col-md-2">
						<p style="margin-bottom:0px;">Start time: {{batch.startTime}}</p>
					</div>
					<div class="col-md-2">
						<p style="margin-bottom:0px;">End time: {{batch.endTime}}</p>
					</div>
				</div>
			</div>

			<div class="card-body">
				<table class="table table-bordered dataTable" id="jobs-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">	          
					<thead>
						<tr role="row" >
							<th>Call name</th>
							<th>No of jobs</th>
							<th>Module name</th>
							<th> </th>
							<th>Start time</th>
							<th>End time</th>
							<th>Status</th>
							<th>Tokens processed</th>
							<th>Progress</th>
							<th>Notes</th>
						</tr>
					</thead>

					<tbody>
						
						<tr role="row" class="job" v-for="job in batch.jobs" v-bind:key="uuidv4()" :id="job.moduleName">
							<td>{{ job.callName }}</td>
							<td>{{ job.noOfJobs }}</td>
							<td>{{ job.moduleName }}</td>
							<td><button id="get-logs" type="button" class="btn btn-info btn-sm" v-on:click="getLogs(job.log_query)" v-mytooltip="'Download logs'" ><i class="fas fa-book"></i>  </button></td>
							<td>{{ job.startTime }}</td>
							<td>{{ job.endTime }}</td>
							<td>{{ job._status }}</td>
							<td>{{ job.tokensProcessed}} of {{job.tokensRecieved}}</td>
							<td>{{ job.progress }}</td>
							<td><span class="text-danger">{{ job.notes }}</span></td>
						</tr>
					</tbody>

				</table>




				<div class="collapse" :id="'id_' + batch.uid">

					<div class="card shadow mb-4" v-for="sub_batch in batch.batches" v-bind:key="uuidv4()">
						
						<div class="card-header py-3">
							
							<div class="row">
								<div class="col-md-4">
									<h6 class="m-0 font-weight-bold text-secondary"><span class="text-success">{{batch._status}}</span> Message: {{sub_batch.batchMsgUid}}</h6>
								</div>
								<div class="col-md-8">
									<p style="margin-bottom:0px;">{{sub_batch.tokensProcessed}} of {{sub_batch.tokensReceived}} tokens processed.</p>
								</div>
							</div>
						<div class="row">
							<div class="col-md-2">
								<p style="margin-bottom:0px;">Consumed credits: {{sub_batch.consumedCredits}} </p>
							</div>
							<div class="col-md-2">
								<p style="margin-bottom:0px;">Node: {{sub_batch.cluster ? sub_batch.cluster.name : 'No Idea'}}</p>
							</div>
							<div class="col-md-2">
								<p style="margin-bottom:0px;">Start time: {{sub_batch._start}}</p>
							</div>
							<div class="col-md-2">
								<p style="margin-bottom:0px;">End time: {{sub_batch._finish}}</p>
							</div>
						</div>
					</div>

						<div class="card-body">
							<table class="table table-bordered dataTable" id="jobs-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
							
								<thead>
									<tr role="row">
										<th></th>
										<th>Call name</th>
										<th>No of jobs</th>
										<th>Module name</th>
										<th> </th>
										<th>Start time</th>
										<th>End time</th>
										<th>Status</th>
										<th>Tokens processed</th>
										<th>Progress</th>
										<th>Notes</th>
									</tr>
								</thead>

								<tbody>
									

									<!-- <tr role="row" class="job" v-for="sub_job in sub_batch.jobs" v-bind:key="uuidv4()" :id="sub_job.moduleName">							
										<td>{{ sub_job.callName }}</td>
										<td>{{ sub_job.noOfJobs }}</td>
										<td>{{ sub_job.moduleName }}</td>
										<td><button id="get-logs" type="button" class="btn btn-info btn-sm" v-on:click="getLogs(sub_job.log_query)"><i class="fas fa-book"></i></button></td>
										<td>{{ sub_job.startTime }}</td>
										<td>{{ sub_job.endTime }}</td>
										<td>{{ sub_job._status }}</td>
										<td>{{ sub_job.tokensProcessed}} of {{sub_job.tokensRecieved}}</td>
										<td>{{ sub_job.progress }}</td>
										<td><span class="text-danger">{{ sub_job.notes }}</span> </td>
									</tr> -->

									<template v-for="(sub_job,ind) in sub_batch.jobs" >
										<tr  role="row" class="job" v-bind:key="uuidv4()" :id="sub_job.moduleName">
											<td  @click="toggleShowDetails" data-toggle="collapse" :data-target="'#id' + ind" class="job accordion-toggle" ><i class="fas fa-chevron-down"></i></td>
											<td>{{ sub_job.callName }}</td>
											<td>{{ sub_job.noOfJobs }}</td>
											<td>{{ sub_job.moduleName }}</td>
											<td><button id="get-logs" type="button" class="btn btn-info btn-sm" v-on:click="getLogs(sub_job.log_query)" v-mytooltip="'Download logs'" ><i class="fas fa-book"></i></button></td>
											<td>{{ sub_job.startTime }}</td>
											<td>{{ sub_job.endTime }}</td>
											<td>{{ sub_job._status }}</td>
											<td>{{ sub_job.tokensProcessed}} of {{sub_job.tokensRecieved}}</td>
											<td>{{ sub_job.progress }}</td>
											<td><span class="text-danger">{{ sub_job.notes }}</span> </td>
										</tr>
										<tr v-bind:key="uuidv4()">
											<td colspan="100" class="hiddenRow" style="padding:0;">
												<div class="accordian-body collapse p-3" :id="'id'+ind">
													<!-- <p>Job 1 : <span>{{sub_job}}</span></p>
													<p>Job 2 : <span>{{sub_job.jobs}}</span> </p>
													<p v-for="(j,ind1) in sub_job.jobs">Job {{ind1}} : <span>{{j}}</span> </p> -->
													
													<table class="table table-bordered dataTable" id="jobs-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">							
														<thead>
															<tr role="row">
																<!-- <th></th> -->
																<!-- <th>Call name</th> -->
																<!-- <th>No of jobs</th> -->
																<!-- <th>Module name</th> -->
																<!-- <th> </th> -->
																<th>Job Msg Uid</th>
																<th></th>
																<th>Start time</th>
																<th>End time</th>
																<th>Status</th>
																<th>Tokens processed</th>
																<th>Progress</th>
																<th>Notes</th>
															</tr>
														</thead>

														<tbody>
															<tr role="row"   v-for="(j,ind1) in sub_job.jobs">
																<!-- <td>{{j.callName}}</td> -->
																<!-- <td>{{j.moduleName}}</td> -->
																<td>{{j.jobMsgUid}}</td>
																<td><button id="get-logs-details" type="button" class="btn btn-info btn-sm" v-on:click="getLogs('tag:' + j.jobMsgUid)" v-mytooltip="'Download logs'"><i class="fas fa-book"></i></button></td>
																<td>{{j._start}}</td>
																<td>{{j._finish}}</td>
																<td>{{j._status}}</td>
																<td>{{j.tokensProcessed}}</td>
																<td>{{j.progress}}</td>
																<td>{{j.notes}}</td>
															</tr>
														</tbody>
													</table>
												</div> 
											</td> 
										</tr>
									</template>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./TaskDetails.js">

</script>
