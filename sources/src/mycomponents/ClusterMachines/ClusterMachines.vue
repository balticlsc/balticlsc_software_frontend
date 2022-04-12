<template>
	<div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="m-0 font-weight-bold text-primary">Machines (cluster: {{ clusterId }})</h6>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-striped table-bordered dataTable" id="tasks-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
					
						<thead>
							<tr role="row">
								<th>#</th>
								<th>MachineId</th>
								<th>CPUs</th>
								<th>GPUs</th>
								<th>Memory</th>
								<th>Storage</th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="cluster" v-for="machine in machines" v-bind:key="machine.id" :id="machine.id">
								<td>{{ machine.nr }}</td>
								<td>{{ machine.id }}</td>
								<td>{{ machine.cpu }}</td>
								<td>{{ machine.gpu }}</td>
								<td>{{ machine.memory }}</td>
								<td>{{ machine.storage }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./ClusterMachines.js"></script>