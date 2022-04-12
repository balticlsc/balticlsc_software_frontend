<template>
	<div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="m-0 font-weight-bold text-primary">Clusters</h6>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-bordered table-striped dataTable" id="tasks-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
						
						<thead>
							<tr role="row">
								<th>ClusterId</th>
								<th>Status</th>
								<th>Endpoint</th>
								<th>Country</th>
								<!-- <th>Machines</th> -->
								<th>Private</th>
								<!-- <th>Availability</th> -->
								<th></th>
								<th></th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="cluster" v-for="cluster in clusters" v-bind:key="cluster.id" :id="cluster.id">
								<td>{{ cluster.id }}</td>
								<td>{{ cluster.status }}</td>
								<td>{{ cluster.endpoint }}</td>
								<td>{{ cluster.country }}</td>
								<!-- <td>{{ cluster.machines }}</td> -->
								<td>{{ cluster.isPrivate }}</td>
								<!-- <td>{{ cluster.highAvailability }}</td> -->
								<td>
									<router-link :to="{ name: 'Benchmarks', params: {clusterId: cluster.id} }">
										Benchmarks
									</router-link>
								</td>

								<td>
									<router-link :to="{ name: 'ClusterMachines', params: {clusterId: cluster.id} }">
										Machines
									</router-link>
								</td>

								<td>
									<router-link :to="{ name: 'ResourcesCredits', params: {clusterId: cluster.id} }">
										Credits
									</router-link>
								</td>

							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

<!-- 		<div class="modal fade" id="new-task-form">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h4 class="modal-title">New Task</h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>
	
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="recipient-name" class="col-form-label">Recipient</label>
								<input id="task-name" type="text" class="form-control">
							</div>

							<div class="form-group">
								<label for="recipient-name" class="col-form-label">Recipient2</label>
								<input type="text" class="form-control">
							</div>

							<div class="form-group">
								<label for="recipient-name" class="col-form-label">Recipient3</label>
								<input type="text" class="form-control">
							</div>

							<div class="form-group">
								<label for="message-text" class="col-form-label">Message</label>
								<textarea class="form-control"></textarea>
							</div>
						</form>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createNewTask">OK</button>
					</div>

				</div>
			</div>
		</div> -->

	</div>

</template>

<script src="./ResourcesShelf.js"></script>