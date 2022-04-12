<template>
	<div>
		<div class="modal" id="delete-ds">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete data set. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete data set.  
							<!-- <span v-if="currApp">"{{currApp.name}}"</span>.  -->
							Are you sure ?
							
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click = "deleteCurrDataSet">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<div class="row">
					<div class="col-md-8">
						<h6 class="m-0 font-weight-bold text-primary">
							Data sets
						</h6>
					</div>
					
					<div class="col-md-4">
						<span v-if="dataSets.length == 0" class="m-2 font-weight-bold text-primary">You have no data sets yet! Add them here <i class="fas fa-hand-point-right fa-2x" ></i></span>
						<button type="button" class="float-right btn btn-success btn-circle btn-sm" data-toggle="modal" data-target="#createDataSet">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-bordered dataTable" id="data-sets-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
						<thead>
							<tr role="row">
								<!-- <th>ID</th> -->

								<th>Name</th>

								<th>Edit</th>

								<th>Multiplicity</th>

								<th>Data Type</th>

								<th>Data Structure</th>

								<th>Access Type</th>

								<th>Access values</th>

								<th>Path values</th>

								<th>Delete</th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="data_set" v-for="dataSet in dataSets" v-bind:key="dataSet.uid" :id="dataSet.uid">
								<!-- <td>{{ dataSet.uid }}</td> -->

								<td>{{ dataSet.name }}</td>

								<td>
									<div class="btn-group-vertical">
										<button type="button" class="btn btn-success btn-sm mb-1" @click="fillEditWindow(dataSet)" data-toggle="modal" :data-target="'#edit_'+dataSet.uid">Edit</button>
										<!-- <br> -->
										<button type="button" class="btn btn-success btn-sm " @click="fillCreateWindow(dataSet)" data-toggle="modal" data-target="#createDataSet">Copy</button>
									</div>
								</td>

								<!-- This would give 1 or 0 -->
								<!-- <td>{{ dataSet.multiplicity }}</td> -->
								<td v-if="dataSet.multiplicity==0">Single</td>
								<td v-else>Multiple</td>

								<td>{{ dataSet.dataTypeName }}</td>

								<td>{{ dataSet.dataStructureName }}</td>

								<td>{{ dataSet.accessTypeName }}</td>

								<!-- "pre" tags are necessary to show JSON strings in a very readable format -->
								<td><pre>{{ dataSet.accessValues }}</pre></td>

								<td><pre>{{ dataSet.values }}</pre></td>

								<td>
									<a href="#" @click = "currDataSet = dataSet"
										data-toggle="modal" data-target="#delete-ds">
											<i class="d-flex justify-content-center fas fa-trash"></i>
									</a>
								</td>

								<div class="modal fade edit-data-set-form" :id="'edit_' + dataSet.uid">
									<div class="modal-dialog">
										<div class="modal-content">
											<div class="modal-header">
												<h4 class="modal-title">Edit data set – {{ dataSet.name }}</h4>

												<button type="button" class="close" @click="clearEditWindow" data-dismiss="modal">&times;</button>
											</div>
											
											<div class="modal-body">
												<div v-if="modalNotification" id="edit-dataset-form-notification"  class="alert alert-dismissible fade show alert-info" :class="modalNotification.type" @click="clearModalMessage()">
													{{modalNotification.msg}}
													<button type="button" class="close" data-dismiss="alert">&times;</button>
												</div>
												<form>
													<div class="form-group">
														<label for="new-data-set-name" class="col-form-label">Name</label>

														<input type="text" class="form-control" id="new-data-set-name" v-model="editDataSetName">
													</div>

													<div class="form-check">
														<input class="form-check-input" type="checkbox" v-model="editDataSetMultiplicityChecked" id="new-data-set-multiplicity">
														
														<label class="form-check-label" for="new-data-set-multiplicity">Multiple</label>
													</div>
													<br/>

													<div class="form-group">
														<label for="new-data-set-data-type-name" class="col-form-label">Data type</label>

														<select class="form-control" id="new-data-set-data-type-name" v-model="editDataSetSelectedDataType">
															<option :value="dataType" v-for="dataType in dataTypes" v-bind:key="dataType.uid" :id="dataType.uid">{{ dataType.name }} ({{dataType.version}})</option>
														</select>

														<div v-if="editDataSetSelectedDataType && editDataSetSelectedDataType.isStructured == true">
															<label for="new-data-set-data-structure-name" class="col-form-label">Data structure</label>

															<select class="form-control" id="new-data-set-data-structure-name" v-model="editDataSetSelectedDataStructure">
																<option :value="null"></option> <!-- Such a beautiful way to add a no data structure option -->
																<option :value="dataStructure" v-for="dataStructure in dataStructures" v-bind:key="dataStructure.uid" :id="dataStructure.uid">{{ dataStructure.name }} ({{dataStructure.version}})</option>
															</select>
														</div>

													</div>

													<vue-form-json-schema v-model="editDataSetStructuredDataSchemaModel" v-if="editDataSetSelectedDataStructure && editDataSetSelectedDataType && editDataSetSelectedDataType.name=='DirectData'" :schema="getSchema(editDataSetSelectedDataStructure.dataSchema)" :ui-schema="getUISchema(editDataSetSelectedDataStructure.dataSchema)"></vue-form-json-schema>

													<div v-if="!editDataSetSelectedDataType || editDataSetSelectedDataType.name!='DirectData'" class="form-group">
														<label for="new-data-set-access-type-name" class="col-form-label">Access type</label>

														<select class="form-control" id="new-data-set-access-type-name" v-model="editDataSetSelectedAccessType">
															<option :value="accessType" v-for="accessType in accessTypes" v-bind:key="accessType.uid" :id="accessType.uid">{{ accessType.name }} ({{accessType.version}})</option>
														</select>
													</div>

													<vue-form-json-schema v-model="editDataSetAccessSchemaModel" v-if="editDataSetSelectedAccessType" :schema="getSchema(editDataSetSelectedAccessType.accessSchema)" :ui-schema="getUISchema(editDataSetSelectedAccessType.accessSchema)"></vue-form-json-schema>
													<vue-form-json-schema v-model="editDataSetPathSchemaModel" v-if="editDataSetSelectedAccessType" :schema="getSchema(editDataSetSelectedAccessType.pathSchema)" :ui-schema="getUISchema(editDataSetSelectedAccessType.pathSchema)"></vue-form-json-schema>
												</form>
											</div>

											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" @click="clearEditWindow" data-dismiss="modal">Cancel</button>

												<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="editDataSet">OK</button>
											</div>
										</div>
									</div>
								</div>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="modal fade new-data-set-form" id="createDataSet">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">Create a new data set</h4>

							<button type="button" class="close" @click="clearCreateWindow" data-dismiss="modal">&times;</button>
						</div>
						
						<div class="modal-body">
							<form>
								<div class="form-group">
									<label for="new-data-set-name" class="col-form-label">Name</label>

									<input type="text" class="form-control" id="new-data-set-name" v-model="createDataSetName">
								</div>
								
								<div class="form-check">
									<input class="form-check-input" type="checkbox" v-model="createDataSetMultiplicityChecked" id="new-data-set-multiplicity">
									
									<label class="form-check-label" for="new-data-set-multiplicity">Multiple</label>
								</div>
								<br/>



								<div class="form-group">
									<label for="new-data-set-data-type-name" class="col-form-label">Data type</label>

									<select class="form-control" id="new-data-set-data-type-name" v-model="createDataSetSelectedDataType">
										<option :value="dataType" v-for="dataType in dataTypes" v-bind:key="dataType.uid" :id="dataType.uid">{{ dataType.name }} ({{dataType.version}})</option>
									</select>

									<div v-if="createDataSetSelectedDataType && createDataSetSelectedDataType.isStructured == true">
										<label for="new-data-set-data-structure-name" class="col-form-label">Data structure</label>

										<select class="form-control" id="new-data-set-data-structure-name" v-model="createDataSetSelectedDataStructure">
											<option :value="null"></option>
											<option :value="dataStructure" v-for="dataStructure in dataStructures" v-bind:key="dataStructure.uid" :id="dataStructure.uid">{{ dataStructure.name }} ({{dataStructure.version}})</option>
										</select>
									</div>

								</div>

								<vue-form-json-schema v-model="createDataSetStructuredDataSchemaModel" v-if="createDataSetSelectedDataStructure && createDataSetSelectedDataType && createDataSetSelectedDataType.name=='DirectData'" :schema="getSchema(createDataSetSelectedDataStructure.dataSchema)" :ui-schema="getUISchema(createDataSetSelectedDataStructure.dataSchema)"></vue-form-json-schema>

								<div v-if="!createDataSetSelectedDataType || createDataSetSelectedDataType.name!='DirectData'" class="form-group">
									<label for="new-data-set-access-type-name" class="col-form-label">Access type</label>

									<select class="form-control" id="new-data-set-access-type-name" v-model="createDataSetSelectedAccessType">
										<option :value="accessType" v-for="accessType in accessTypes" v-bind:key="accessType.uid" :id="accessType.uid">{{ accessType.name }} ({{accessType.version}})</option>
									</select>
								</div>

								<vue-form-json-schema v-model="createDataSetAccessSchemaModel" v-if="createDataSetSelectedAccessType" :schema="getSchema(createDataSetSelectedAccessType.accessSchema)" :ui-schema="getUISchema(createDataSetSelectedAccessType.accessSchema)"></vue-form-json-schema>
								<vue-form-json-schema v-model="createDataSetPathSchemaModel" v-if="createDataSetSelectedAccessType" :schema="getSchema(createDataSetSelectedAccessType.pathSchema)" :ui-schema="getUISchema(createDataSetSelectedAccessType.pathSchema)"></vue-form-json-schema>
								
							</form>
						</div>

						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" @click="clearCreateWindow" data-dismiss="modal">Cancel</button>

							<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createNewDataSet">OK</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./DataShelf.js"></script>
