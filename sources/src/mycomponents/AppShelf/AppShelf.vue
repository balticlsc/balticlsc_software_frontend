<template>
	<div>
		<span v-if="loading" class="m-2 font-weight-bold text-primary">Loading ...</span>
		<span v-if="!loading && appsWithTasks.length == 0" class="m-2 font-weight-bold text-primary"><i class="fas fa-hand-point-left fa-2x m-2"></i>No apps here yet. Go to <router-link :to="{ name: 'AppStore' }">App Store </router-link> to get some!</span>
		<div class="card shadow mb-4 app" v-for="app in appsWithTasks" v-bind:key="app.uid" :id="app.uid">
			<div class="card-header py-3">
				<div class="row">
					<div class="col-md-8">
						<h6 class="m-0 font-weight-bold text-primary">
							<router-link :to="{ name: 'AppDetails', params: {id: app.uid } }">
								{{ app.name }}
							</router-link>
						</h6>
					</div>

					<div class="col-md-4">
						<span v-if="!loading && tasks.length == 0" class="font-weight-bold text-primary">No tasks here yet. You can add some here <i class="fas fa-hand-point-right fa-2x"></i></span>
						<button type="button" class="float-right btn btn-success btn-circle btn-sm" data-toggle="modal" :data-target="app.form" @click="getAvailableClustersForRelease(app.versions[0].releaseUid)">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-bordered dataTable" id="tasks-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">

						<thead>
							<tr role="row">
								<th>Name</th>
								<th>Version</th>
								<th>Actions</th>
								<th>Start time</th>
								<th>End time</th>
								<th>Consumed credits</th>
								<th>Reserved credits</th>
								<th>Status</th>
								<th>Priority</th>
								<th>Private</th>
								<th>Cluster allocation</th>
								
								<th>Archive</th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="task" v-for="task in app.tasks" v-bind:key="task.uid" :id="task.uid">
								<td>
									<router-link :to="{ name: 'TaskDetails', params: {id: task.uid } }">
										{{ task.parameters.taskName }}
									</router-link>
								</td>
								<td>
									<router-link v-if="task._diagram != null" :to="{ name: 'ComputationApplicationReadOnly', params: {applicationId: task._diagram } }">
													{{ task._version }}
									</router-link>
									<span v-else> {{ task._version }} </span>
								</td>
								<td>
									<button v-if="isInsertable(task)" type="button" class="btn btn-success btn-sm" data-toggle="modal" :data-target="task.form" disabled>Insert</button>
									<button v-if="isStartable(task)" type="button" class="btn btn-success btn-sm" data-toggle="modal" :data-target="task.form">Start</button>
									<button v-if="isAbortable(task)" type="button" class="btn btn-danger btn-sm" data-toggle="modal" :data-target="task.formAbort">Abort</button>
								</td>
								<td>{{ task._startTime }}</td>
								<td>{{ task._endTime }}</td>

								<td>{{ task.consumedCredits }}</td>
								<td>{{ task.parameters.reservedCredits }}</td>

								<td>{{ task._status }}</td>
								<td>{{ task.parameters.priority }}</td>
								<td>{{ task._private }}</td>
								<td>{{ task.parameters.clusterAllocation }}</td>

								<td>
									<!-- v-on:click="removeTask" -->
									<a v-if="!task.isArchived && (task.status==2 || task.status==3 || task.status==4 || task.status==5 ) " href="#"  
										data-toggle="modal"
										data-target="#archive-task-confirmation"
										@click="idOfTaskToArchive = task.uid"
									>
										<i class="d-flex justify-content-center fas fa-trash"></i>
									</a>
								</td>
								
								<div class="modal fade " id="archive-task-confirmation">
									<div class="modal-dialog">
										<div class="modal-content">

											<div class="modal-header">
												<h4 class="modal-title">Do You really want to archive this task ?</h4>
												<button type="button" class="close" data-dismiss="modal">&times;</button>
											</div>

											<div class="modal-body">
												<div class="alert alert-danger" role="alert">
													You are about to archive this task.
													Are you sure ?
												</div>
											</div>

											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
												<button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="removeTask2">Archive</button>
											</div>
										</div>
									</div>
								</div>


								<div class="modal fade abort-task-form" :id="task.formIdAbort" :data-app="task.uid">
									<div class="modal-dialog">
										<div class="modal-content">

											<div class="modal-header">
												<h4 class="modal-title">Do You really want to abort {{task.parameters.taskName}} ?</h4>
												<button type="button" class="close" data-dismiss="modal">&times;</button>
											</div>

											<div class="modal-body">
											</div>

											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
												<button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="abortTask">Abort</button>
											</div>
										</div>
									</div>
								</div>

								<div class="modal fade insert-task-form" :id="task.formId" :data-app="task.uid">
									<div class="modal-dialog">
										<div class="modal-content">

											<div class="modal-header">
												<h4 class="modal-title">Insert Datasets for {{task.parameters.taskName}}</h4>
												<button type="button" class="close" data-dismiss="modal">&times;</button>
											</div>
							
											<div class="modal-body">
												<form>
													<div class="row">
														<div class="col-md-6">
															<p> Required </p>
															<div class="form-group" :id="task.uid" v-for="pin in filterPins(task.pins,[0,1])" v-bind:key="pin.uid">
																<label :for="pin.uid">{{pin.name}}</label>
																<select class="form-control" :id="pin.uid" >
																	<option disabled value="">Please select one</option>
																	<option :value="dataset.name" v-for="dataset in pin.dataSets" v-bind:key="dataset.uid" :id="dataset.uid">{{ dataset.name }}</option>
																</select>
															</div>
														</div>
														<div class="col-md-6">
															<p> Provided </p>
															<div class="form-group" :id="task.uid" v-for="pin in filterPins(task.pins,[2,3])" v-bind:key="pin.uid">
																<label :for="pin.uid">{{pin.name}}</label>
																<select class="form-control" :id="pin.uid" >
																	<option disabled value="">Please select one</option>
																	<option :value="dataset.name" v-for="dataset in pin.dataSets" v-bind:key="dataset.uid" :id="dataset.uid">{{ dataset.name }}</option>
																</select>
															</div>
														</div>
													</div>
												</form>
											</div>

											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
												<button v-if="isInsertable(task)" type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="InsertDataSets">Insert</button>
												<button v-if="isStartable(task)" type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="InsertDataSets">Start</button>
											</div>

										</div>
									</div>
								</div>


							</tr>

						</tbody>
					</table>
				</div>
			</div>


			<div class="modal fade new-task-form" :id="app.formId" :data-app="app.uid" @show="newTaskFormShown($event)">
				<div class="modal-dialog">
					<div class="modal-content">

						<div class="modal-header">
							<h4 class="modal-title">Initiate Task</h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
						</div>
		
						<div class="modal-body">
							<form>




<!-- 								<div>
									<b-form-slider :value="value" @slide-start="slideStart" @slide-stop="slideStop"></b-form-slider>
									<p>Slider has value {{ value }}</p>
								</div> -->

								<div class="form-group">
									<label for="new-task-name" class="col-form-label">Name</label>
									<input type="text" class="form-control" id="new-task-name">
								</div>

								<div class="form-group">
									<label for="new-priority">Version</label>
									<select class="form-control" id="release" @change="AddTaskVersionChanged($event)">
										<option :value="version.releaseUid" v-for="version in app.versions" v-bind:key="version.releaseUid" :id="version.releaseUid">{{ version.version }}</option>
									</select>
								</div>

								<div class="form-group">
									<label for="new-priority">Priority</label>
									<select class="form-control" id="new-priority">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3" selected="selected">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
									</select>
								</div>

								<div class="form-group">
									<label for="new-reserved-credits" class="col-form-label">Reserved credits</label>
									<input type="number" class="form-control" id="new-reserved-credits" value="100">
								</div>

								<div class="form-group">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" id="new-is-private">
										<label class="form-check-label" for="new-is-private">
											Is private
										</label>
									</div>
								</div>
								<div>
									<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseDetails" aria-expanded="false" aria-controls="collapseDetails">
										Additional details ...
									</button>
								</div>
								<div class="collapse" id="collapseDetails">
									<div class="card card-body">
										<fieldset class="form-group row">	
											<legend class="col-form-label col-sm-10 pt-0">Cluster allocation</legend>
											<div class="col-sm-10">
												<div class="form-check form-check-inline">
													<input class="form-check-input" type="radio" name="gridRadios" value="strong" id="strong" checked @change="AddTaskClusterAllocationChanged($event)">
													<label class="form-check-label" for="strong">
														Strong
													</label>
												</div>
												<div class="form-check form-check-inline">
													<input class="form-check-input" type="radio" name="gridRadios" value="weak" id="weak" @change="AddTaskClusterAllocationChanged($event)">
													<label class="form-check-label" for="weak">
														Weak
													</label>
												</div>
											</div>
										</fieldset>

										<div class="form-group">
											<label for="new-priority">Cluster</label>
											<select class="form-control" id="cluster" >
												<option :value="cluster.uid" v-for="cluster in clusters" v-bind:key="cluster.uid" :id="cluster.uid">{{ cluster.name }}</option>
											</select>
										</div>

										<fieldset class="form-group row">	
											<legend class="col-form-label col-sm-10 pt-0">Failure Handling Policy</legend>
											<div class="col-sm-10">
												<div class="form-check form-check-inline">
													<input class="form-check-input" type="radio" name="gridRadios2" value="Break" id="Break" checked>
													<label class="form-check-label" for="Break">
														Break
													</label>
												</div>
												<div class="form-check form-check-inline">
													<input class="form-check-input" type="radio" name="gridRadios2" value="Continue" id="Continue">
													<label class="form-check-label" for="Continue">
														Continue
													</label>
												</div>
												<div class="form-check form-check-inline">
													<input class="form-check-input" type="radio" name="gridRadios2" value="Freeze" id="Freeze">
													<label class="form-check-label" for="Freeze">
														Freeze
													</label>
												</div>
											</div>
										</fieldset>

										<div class="form-group">
											<label for="new-auxstorage-credits" class="col-form-label">Aux storage credits</label>
											<input type="number" class="form-control" id="new-auxstorage-credits" value="100">
										</div>

										<div class="form-group">
											<label for="new-cpu" class="col-form-label">CPU</label>
											<br>
											<b-form-slider id="new-cpu" ref="new-cpu" v-model="app.cpu.range" range :min="app.cpu.min" :max="app.cpu.max"></b-form-slider>

											<!-- <input type="range" class="form-control-range" id="new-cpu" :value="app.cpu.value" :min="app.cpu.min" :max="app.cpu.max"> -->
										</div>

										<div class="form-group">
											<label for="new-gpu" class="col-form-label">GPU</label>
											<br>
											<b-form-slider id="new-gpu" ref="new-gpu" v-model="app.gpu.range" range :min="app.gpu.min" :max="app.gpu.max"></b-form-slider>									
											<!-- <input type="range" class="form-control-range" id="new-gpu" :value="app.gpu.value" :min="app.gpu.min" :max="app.gpu.max"> -->
										</div>

									<div class="form-group">
										<label for="new-memory" class="col-form-label">Memory</label>
										<br>
										<b-form-slider id="new-memory" ref="new-memory" v-model="app.memory.range" range :min="app.memory.min" :max="app.memory.max"></b-form-slider>
										<!-- <input type="range" class="form-control-range" id="new-memory" :value="app.memory.value" :min="app.memory.min" :max="app.memory.max"> -->
									</div>

									<div class="form-group">
										<label for="new-storage" class="col-form-label">Storage</label>
										<br>
										<b-form-slider id="new-storage" ref="newStorage" v-model="app.storage.range" range :min="app.storage.min" :max="app.storage.max"></b-form-slider>
										<!-- <input type="range" class="form-control-range" id="new-storage" :value="app.storage.value" :min="app.storage.min" :max="app.storage.max"> -->
									</div>

								</div>
							</div>
						</form>
					</div>

						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createNewTask">Create</button>
							<!-- <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createAndInsertTask">Create&Insert</button> -->
						</div>

					</div>
				</div>
			</div>





		</div>
	</div>

</template>

<script src="./AppShelf.js"></script>