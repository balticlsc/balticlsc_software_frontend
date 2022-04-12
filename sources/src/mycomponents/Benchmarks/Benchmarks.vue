<template>
	<div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="m-0 font-weight-bold text-primary">Benchmarks (cluster: {{ clusterId }})</h6>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-striped table-bordered dataTable" id="tasks-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
					
						<thead>
							<tr role="row">
								<th>#</th>
								<th>Name</th>
								<th>TimeScore</th>
								<th>ResourceScore</th>
								<th>Date</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="benchmark" v-for="benchmark in benchmarks" v-bind:key="benchmark.id" :id="benchmark.id">
								<td>{{ benchmark.nr }}</td>
								<td>{{ benchmark.name }}</td>
								<td>{{ benchmark.timeScore }}</td>
								<td>{{ benchmark.resourceScore }}</td>
								<td>{{ benchmark.date }}</td>
								<td>
									<router-link :to="{ name: 'BenchmarkDetails', params: {benchmarkId: benchmark.id} }">
										Details
									</router-link>
								</td>

							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./Benchmarks.js"></script>