import { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { UserContext } from '../Context/UserContext';
import {
	collection,
	addDoc,
	query,
	where,
	onSnapshot,
	doc,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';

Modal.setAppElement('#root');

const AddJobModal = ({ isOpen, closeModal, editJob }) => {
	const [companyName, setCompanyName] = useState('');
	const [jobRole, setJobRole] = useState('');
	const [jobLink, setJobLink] = useState('');
	const [appliedDate, setAppliedDate] = useState(null);
	const [status, setStatus] = useState('');
	const [location, setLocation] = useState('');
	const [jobDescription, setJobDescription] = useState('');
	const [isEditMode, setIsEditMode] = useState(false);
	const [editJobId, setEditJobId] = useState(null);
	const [formError, setFormError] = useState('');

	const userContext = useContext(UserContext);
	const { user } = userContext;

	useEffect(() => {
		if (editJob) {
			setCompanyName(editJob.companyName);
			setJobRole(editJob.jobRole);
			setJobLink(editJob.jobLink);
			setAppliedDate(editJob.appliedDate.toDate());
			setStatus(editJob.status);
			setJobDescription(editJob.jobDescription);
			setLocation(editJob.location);
			setIsEditMode(true);
			setEditJobId(editJob.id);
		} else {
			clearForm();
		}
	}, [editJob]);

	const clearForm = () => {
		setCompanyName('');
		setJobRole('');
		setJobLink('');
		setAppliedDate(null);
		setStatus('');
		setLocation('');
		setJobDescription('');
		setIsEditMode(false);
		setEditJobId(null);
		setFormError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const linkRegex =
			/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)(\/[^\s]*)?$/;

		if (
			!companyName ||
			!jobRole ||
			!jobLink ||
			!appliedDate ||
			!status ||
			!location ||
			!jobDescription
		) {
			setFormError('Please fill in all fields.');
			return;
		}

		if (!linkRegex.test(jobLink)) {
			setFormError(
				'Please enter a valid website address (e.g., www.something.com)'
			);
			return;
		}

		try {
			if (isEditMode && editJobId) {
				// Update existing job document
				const jobRef = doc(firestore, 'jobs', editJobId);
				await updateDoc(jobRef, {
					companyName,
					jobRole,
					jobLink,
					appliedDate,
					location,
					status,
					jobDescription,
				});
			} else {
				await addDoc(collection(firestore, 'jobs'), {
					companyName,
					jobRole,
					jobLink,
					location,
					appliedDate,
					status,
					jobDescription,
					userId: user.uid,
				});
			}
			clearForm();
			closeModal();
		} catch (error) {
			console.error('Error adding/updating document: ', error);
		}
	};

	return (
		<Modal isOpen={isOpen} onRequestClose={closeModal}>
			<h2>{isEditMode ? 'Edit Job' : 'Add Job'}</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Company Name:
					<input
						type="text"
						value={companyName}
						onChange={(e) => setCompanyName(e.target.value)}
					/>
				</label>
				<label>
					Job Role:
					<input
						type="text"
						value={jobRole}
						onChange={(e) => setJobRole(e.target.value)}
					/>
				</label>
				<label>
					Location:
					<input
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
				</label>
				<label>
					Job Link:
					<input
						type="text"
						value={jobLink}
						onChange={(e) => setJobLink(e.target.value)}
					/>
				</label>
				<label>
					Applied Date:
					<DatePicker selected={appliedDate} onChange={setAppliedDate} />
				</label>
				<label>
					Status:
					<select value={status} onChange={(e) => setStatus(e.target.value)}>
						<option value="">Select Status</option>
						<option value="Selected">Selected</option>
						<option value="In Progress">In Progress</option>
						<option value="Ghosted">Ghosted</option>
						<option value="Interviewed">Interviewed</option>
					</select>
				</label>
				<label>
					Job Description:
					<textarea
						value={jobDescription}
						onChange={(e) => setJobDescription(e.target.value)}
					/>
				</label>
				{formError && <p className="error">{formError}</p>}
				<button type="submit">{isEditMode ? 'Update' : 'Submit'}</button>
			</form>
		</Modal>
	);
};

const JobTracker = () => {
	const [jobs, setJobs] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editJob, setEditJob] = useState(null);
	const userContext = useContext(UserContext);
	const { user } = userContext;

	useEffect(() => {
		const q = query(
			collection(firestore, 'jobs'),
			where('userId', '==', user.uid)
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const jobsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setJobs(jobsData);
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditJob(null);
	};

	const handleEdit = (job) => {
		setEditJob(job);
		setIsModalOpen(true);
	};

	const handleDelete = async (jobId) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this job?'
		);
		if (confirmDelete) {
			try {
				await deleteDoc(doc(firestore, 'jobs', jobId));
				console.log('Document successfully deleted!');
			} catch (error) {
				console.error('Error removing document: ', error);
			}
		}
	};

	return (
		<div>
			{jobs.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Company</th>
							<th>Role</th>
							<th>Link</th>
							<th>Date Applied</th>
							<th>Status</th>
							<th>Description</th>
							<th>Location</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{jobs.map((job) => (
							<tr key={job.id}>
								<td>{job.companyName}</td>
								<td>{job.jobRole}</td>
								<td>
									<a
										href={
											job.jobLink.startsWith('http')
												? job.jobLink
												: `https://${job.jobLink}`
										}
										target="_blank"
										rel="noopener noreferrer"
									>
										{job.jobLink}
									</a>
								</td>
								<td>{job.appliedDate.toDate().toLocaleDateString()}</td>
								<td>{job.status}</td>
								<td>{job.jobDescription}</td>
								<td>{job.location}</td>
								<td>
									<button onClick={() => handleEdit(job)}>Edit</button>
									<button onClick={() => handleDelete(job.id)}>Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No jobs found.</p>
			)}
			<button onClick={openModal}>Add Job</button>
			<AddJobModal
				isOpen={isModalOpen}
				closeModal={closeModal}
				editJob={editJob}
			/>
		</div>
	);
};
export default JobTracker;
